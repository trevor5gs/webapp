import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { debounce } from 'lodash'
import Avatar from '../assets/Avatar'
import Block from './Block'
import EmbedBlock from './EmbedBlock'
import ImageBlock from './ImageBlock'
import QuickEmoji from './QuickEmoji'
import RepostBlock from './RepostBlock'
import TextBlock from './TextBlock'
import PostActionBar from './PostActionBar'
import * as ACTION_TYPES from '../../constants/action_types'
import { addDragObject, removeDragObject } from './DragComponent'
import { addInputObject, removeInputObject } from './InputComponent'
import { userRegex } from '../completers/Completer'

class BlockCollection extends Component {

  static propTypes = {
    avatar: PropTypes.object.isRequired,
    blocks: PropTypes.array,
    cancelAction: PropTypes.func.isRequired,
    completions: PropTypes.shape({
      data: PropTypes.array,
      type: PropTypes.string,
    }),
    dispatch: PropTypes.func.isRequired,
    editorId: PropTypes.string.isRequired,
    editorStore: PropTypes.object,
    emoji: PropTypes.object.isRequired,
    isComment: PropTypes.bool,
    isOwnPost: PropTypes.bool,
    postId: PropTypes.string,
    repostContent: PropTypes.array,
    shouldLoadFromState: PropTypes.bool,
    shouldPersist: PropTypes.bool,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string,
  };

  static defaultProps = {
    blocks: [],
    editorStore: {},
    isComment: false,
    repostContent: [],
    shouldLoadFromState: false,
    shouldPersist: false,
    submitText: 'Post',
  };

  componentWillMount() {
    const { blocks, editorStore, repostContent, shouldLoadFromState } = this.props
    this.state = {
      collection: {},
      hideTextTools: true,
      loadingImageBlocks: [],
      order: [],
    }
    this.uid = 0

    if (repostContent.length) {
      this.add({ kind: 'repost', data: repostContent })
    }
    if (blocks.length) {
      for (const block of blocks) {
        this.add(block, false)
      }
    } else if (shouldLoadFromState && editorStore.editorState) {
      this.state = { ...editorStore.editorState, hideTextTools: true, loadingImageBlocks: [] }
      this.uid = Math.max(...editorStore.editorState.order) + 1
    }
    this.persistBlocks = debounce(this.persistBlocks, 300)
  }

  componentDidMount() {
    const { editorId } = this.props
    // TODO: figure out why this is causing a setState warning
    // you can get the error to happen by going to a profile page
    // visiting a post detail and then hitting back, the setState
    // happens in add, but is triggered from this method since
    // commenting it out gets rid of the issue
    this.addEmptyTextBlock()
    addDragObject({ component: this, dragId: editorId })
    addInputObject(this)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, editorId, editorStore } = nextProps
    const { collection, loadingImageBlocks } = this.state
    let newBlock = null
    let index = -1
    let loadedContentData = null
    switch (editorStore.type) {
      case ACTION_TYPES.EDITOR.APPEND_TEXT:
        if (editorStore.appendText && editorStore.appendText.length) {
          this.appendText(editorStore.appendText)
          dispatch({ type: ACTION_TYPES.EDITOR.CLEAR_APPENDED_TEXT, payload: { editorId } })
        }
        break
      case ACTION_TYPES.POST.TMP_IMAGE_CREATED:
        this.removeEmptyTextBlock()
        newBlock = this.add({
          kind: 'image',
          data: { url: editorStore.loadedContent[editorStore.index].url },
          index: editorStore.index,
        })
        dispatch({
          type: ACTION_TYPES.POST.IMAGE_BLOCK_CREATED,
          payload: {
            editorId,
            uid: newBlock.uid,
            index: editorStore.index,
          },
        })
        // we have one that is uploading to s3
        loadingImageBlocks.push(newBlock.uid)
        this.setState({ loadingImageBlocks })
        break
      case ACTION_TYPES.POST.SAVE_IMAGE_SUCCESS:
        loadedContentData = editorStore.loadedContent[editorStore.index]
        newBlock = this.getBlockFromUid(loadedContentData.uid)
        if (newBlock) {
          collection[this.getBlockIdentifier(loadedContentData.uid)] = {
            kind: 'image',
            data: {
              url: loadedContentData.url,
            },
            uid: loadedContentData.uid,
          }
          this.setState({ collection })
          this.persistBlocks()
          // can stop the uploading whatever
          index = loadingImageBlocks.indexOf(loadedContentData.uid)
          loadingImageBlocks.splice(index, 1)
          this.setState({ loadingImageBlocks })
        }
        break
      case ACTION_TYPES.POST.POST_PREVIEW_SUCCESS:
        this.removeEmptyTextBlock()
        this.add({ ...editorStore.loadedContent[editorStore.index].postPreviews.body[0] })
        break
      default:
        break
    }
  }

  componentDidUpdate(prevProps) {
    const { completions } = this.props
    const prevCompletions = prevProps.completions
    if (prevCompletions && !completions) {
      requestAnimationFrame(() => {
        this.updateTextCollectionData()
      })
    }
  }

  componentWillUnmount() {
    // this.onHideCompleter()
    removeDragObject(this)
    removeInputObject(this)
  }

  onDragStart(props) {
    const { collection } = this.state
    this.blockNode = props.target.parentNode.parentNode
    this.startOffset = this.blockNode.offsetTop
    this.startHeight = this.blockNode.offsetHeight
    this.prevBlock = this.blockNode.previousSibling
    this.nextBlock = this.blockNode.nextSibling
    const dragUid = this.blockNode.dataset.collectionId
    this.dragBlock = collection[this.getBlockIdentifier(dragUid)]
    // swap the dragging block for a
    // normal block and set the height/width
    collection[this.getBlockIdentifier(dragUid)] = {
      data: {
        width: this.blockNode.offsetWidth,
        height: this.blockNode.offsetHeight,
      },
      kind: 'block',
      uid: this.dragBlock.uid,
    }
    this.onDragMove(props)
    this.setState({ collection })
    ReactDOM.findDOMNode(document.body).classList.add('isDragging')
  }

  onDragMove(props) {
    // move the block we are currently dragging
    this.setState({ dragBlockTop: props.dragY + this.startOffset })
    // determine if we should change order
    if (props.dragY < props.lastDragY) {
      this.onDragUp(props)
    } else if (props.dragY > props.lastDragY) {
      this.onDragDown(props)
    }
  }

  onDragUp(props) {
    if (this.prevBlock &&
        !this.prevBlock.classList.contains('readonly') &&
        (props.dragY + this.startOffset) <
        (this.prevBlock.offsetTop + this.prevBlock.offsetHeight * 0.5)) {
      this.onMoveBlock(-1)
    }
  }

  onDragDown(props) {
    if (this.nextBlock &&
        (props.dragY + this.startOffset + this.startHeight) >
        (this.nextBlock.offsetTop + this.nextBlock.offsetHeight * 0.5)) {
      this.onMoveBlock(1)
    }
  }

  onMoveBlock(delta) {
    if (!this.refs.blockPlaceholder) return
    const { order } = this.state
    const dragUid = this.dragBlock.uid
    const index = order.indexOf(dragUid)
    // remove from old spot
    order.splice(index, 1)
    // add to new spot
    order.splice(index + delta, 0, dragUid)
    this.setState({ order })
    const placeholder = this.refs.blockPlaceholder.refs.editorBlock
    // update prev/next blocks
    this.prevBlock = placeholder.previousSibling
    this.nextBlock = placeholder.nextSibling
  }

  onDragEnd() {
    const { collection } = this.state
    // swap the normal block out for
    // the one that was removed initially
    const dragUid = this.dragBlock.uid
    collection[this.getBlockIdentifier(dragUid)] = this.dragBlock
    // order matters here so the dragBlock gets removed
    ReactDOM.findDOMNode(document.body).classList.remove('isDragging')
    this.dragBlock = null
    this.setState({ collection, dragBlockTop: null })
    this.addEmptyTextBlock(true)
  }

  onSubmitPost() {
    const { editorId } = this.props
    if (document.activeElement.parentNode.dataset.editorId === editorId) {
      this.submit()
    }
  }

  onInsertEmoji = ({ value }) => {
    this.appendText(value)
  };

  getBlockIdentifier(uid) {
    const { editorId } = this.props
    return `${editorId}_${uid}`
  }

  getBlockFromUid(uid) {
    const { collection } = this.state
    return collection[this.getBlockIdentifier(uid)]
  }

  getBlockElement(block) {
    const { editorId } = this.props
    const { loadingImageBlocks } = this.state
    const isUploading = loadingImageBlocks.indexOf(block.uid) !== -1
    const blockProps = {
      data: block.data,
      editorId,
      key: block.uid,
      kind: block.kind,
      onRemoveBlock: this.remove,
      ref: `block${block.uid}`,
      uid: block.uid,
      className: classNames({ isUploading }),
    }
    switch (block.kind) {
      case 'block':
        return (
          <Block
            { ...blockProps }
            className={ classNames('BlockPlaceholder', { isUploading }) }
            ref="blockPlaceholder"
          />
        )
      case 'embed':
        return (
          <EmbedBlock { ...blockProps } />
        )
      case 'image':
        return (
          <ImageBlock { ...blockProps } />
        )
      case 'repost':
        return (
          <RepostBlock { ...blockProps } onRemoveBlock={ null } />
        )
      case 'text':
        return (
          <TextBlock
            { ...blockProps }
            onInput={ this.handleTextBlockInput }
          />
        )
      default:
        return null
    }
  }

  // TODO: probably should have the completer
  // dispatch an action that updates the gui
  // and then we can listen to that instead
  // of brute forcing it with dom lookups
  updateTextCollectionData() {
    const { editorId } = this.props
    const { collection, order } = this.state
    for (const uid of order) {
      const block = this.getBlockFromUid(uid)
      if (block && block.kind === 'text') {
        const selector = `[data-editor-id="${editorId}"][data-collection-id="${uid}"]`
        const elem = document.querySelector(selector)
        if (elem && elem.firstChild) {
          block.data = elem.firstChild.innerHTML
        }
      }
    }
    this.setState({ collection })
  }

  add(block, shouldCheckForEmpty = true) {
    const newBlock = { ...block, uid: this.uid }
    const { collection, order } = this.state
    collection[this.getBlockIdentifier(this.uid)] = newBlock
    order.push(this.uid)
    // this is so the uid remains unique even if image
    // loads/embeds come back in a different order
    // than they went out in.
    if (typeof newBlock.index !== 'undefined') {
      this.uid = this.uid + parseInt(newBlock.index, 10) + 1
    } else {
      this.uid++
    }
    // order matters here
    this.setState({ collection, order })
    if (shouldCheckForEmpty) {
      this.addEmptyTextBlock()
    }
    this.persistBlocks()
    return newBlock
  }

  addEmptyTextBlock(shouldCheckForEmpty = false) {
    const { order } = this.state
    requestAnimationFrame(() => {
      if (order.length > 1) {
        const last = this.getBlockFromUid(order[order.length - 1])
        const secondToLast = this.getBlockFromUid(order[order.length - 2])
        if (secondToLast.kind === 'text' &&
            last.kind === 'text' && !last.data.length) {
          return this.remove(last.uid, shouldCheckForEmpty)
        }
      }
      if (!order.length ||
          this.getBlockFromUid(order[order.length - 1]).kind !== 'text') {
        this.add({ kind: 'text', data: '' }, false)
      }
    })
  }

  appendText = (content) => {
    const { collection, order } = this.state
    const textBlocks = order.filter((uid) => this.getBlockFromUid(uid).kind === 'text')
    const lastBlock = this.getBlockFromUid(textBlocks[textBlocks.length - 1])
    if (lastBlock) {
      lastBlock.data += content
      this.setState({ collection })
    }
  };

  remove = (uid, shouldCheckForEmpty = true) => {
    const { collection, order } = this.state
    delete collection[this.getBlockIdentifier(uid)]
    order.splice(order.indexOf(uid), 1)
    // order matters here
    this.setState({ collection, order })
    if (shouldCheckForEmpty) {
      this.addEmptyTextBlock()
    }
    this.persistBlocks()
  };

  persistBlocks() {
    const { dispatch, editorId, shouldPersist } = this.props
    if (!shouldPersist) { return }
    const { collection, order } = this.state
    dispatch({
      type: ACTION_TYPES.POST.PERSIST,
      payload: {
        collection,
        editorId,
        order,
      },
    })
  }

  removeEmptyTextBlock() {
    const { order } = this.state
    if (order.length > 0) {
      const last = this.getBlockFromUid(order[order.length - 1])
      if (last && last.kind === 'text' && !last.data.length) {
        this.remove(last.uid, false)
      }
    }
  }

  handleTextBlockInput = (vo) => {
    const { collection } = this.state
    collection[this.getBlockIdentifier(vo.uid)] = vo
    this.setState({ collection })
    this.persistBlocks()
  };

  replyAll = () => {
    const { postId } = this.props
    if (!postId) { return }
    const nameArr = []
    const usernames = document.querySelectorAll(`#Post_${postId} .CommentUsername`)
    for (const node of usernames) {
      if (nameArr.indexOf(node.innerHTML) === -1) {
        nameArr.push(node.innerHTML)
      }
    }
    if (nameArr.length) {
      this.appendText(`${nameArr.join(' ')} `)
    }
  };

  submit = () => {
    const { isComment, submitAction } = this.props
    const data = this.serialize()
    // prevent submit from happening until all
    // embeds have data and all images have urls
    submitAction(data)
    if (isComment) {
      this.clearBlocks()
    }
  };

  clearBlocks = () => {
    this.setState({ collection: {}, order: [] })
    requestAnimationFrame(() => {
      this.uid = 0
      this.addEmptyTextBlock()
    })
  };

  serialize() {
    const { order } = this.state
    const results = []
    for (const uid of order) {
      const block = this.getBlockFromUid(uid)
      switch (block.kind) {
        case 'text':
          if (block.data.length) {
            results.push({ kind: block.kind, data: block.data })
          }
          break
        case 'repost':
          break
        default:
          results.push({ kind: block.kind, data: block.data })
          break
      }
    }
    return results
  }

  hasMention() {
    const { order } = this.state
    for (const uid of order) {
      const block = this.getBlockFromUid(uid)
      if (block && block.kind === 'text' && block.data.match(userRegex)) {
        return true
      }
    }
    return false
  }

  hasContent() {
    const { order } = this.state
    const firstBlock = this.getBlockFromUid(order[0])
    if (!firstBlock) { return false }
    return (
      order.length > 1 ||
      firstBlock &&
      firstBlock.data.length &&
      firstBlock.data !== '<br>'
    )
  }

  render() {
    const { avatar, cancelAction, editorId, isComment, isOwnPost, submitText } = this.props
    const { dragBlockTop, loadingImageBlocks, order } = this.state
    const hasMention = this.hasMention()
    const hasContent = this.hasContent()
    return (
      <div
        className={ classNames('editor', { hasMention, hasContent, isComment }) }
        data-placeholder="Say Ello..."
      >
        { isComment ? <Avatar sources={ avatar }/> : null }
        <div
          className="editor-region"
          data-num-blocks={ order.length }
        >
          { order.map((uid) => this.getBlockElement(this.getBlockFromUid(uid))) }
          { this.dragBlock ?
            <div className="DragBlock" style={{ top: dragBlockTop }}>
              { this.getBlockElement(this.dragBlock) }
            </div> :
            null
          }
        </div>
        { isComment ? <QuickEmoji onAddEmoji={ this.onInsertEmoji }/> : null }
        <PostActionBar
          cancelAction={ cancelAction }
          disableSubmitAction={ loadingImageBlocks.length > 0 }
          editorId={ editorId }
          ref="postActionBar"
          replyAllAction={ isComment && isOwnPost ? this.replyAll : null }
          submitAction={ this.submit }
          submitText={ submitText }
        />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    avatar: state.profile.avatar,
    completions: state.editor.completions,
    editorStore: state.editor.editors[ownProps.editorId],
    emoji: state.emoji,
    postId: ownProps.post ? `${ownProps.post.id}` : null,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(BlockCollection)

