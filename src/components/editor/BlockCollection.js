import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { delay, isEqual } from 'lodash'
import Avatar from '../assets/Avatar'
import Block from './Block'
import EmbedBlock from './EmbedBlock'
import ImageBlock from './ImageBlock'
import QuickEmoji from './QuickEmoji'
import RepostBlock from './RepostBlock'
import TextBlock from './TextBlock'
import PostActionBar from './PostActionBar'
import { reorderBlocks, saveAsset, updateDragBlock } from '../../actions/editor'
import { closeOmnibar } from '../../actions/omnibar'
import { scrollToTop } from '../../vendor/scrollTop'
import * as ACTION_TYPES from '../../constants/action_types'
import { addDragObject, removeDragObject } from './DragComponent'
import { addInputObject, removeInputObject } from './InputComponent'
import { userRegex } from '../completers/Completer'

class BlockCollection extends Component {

  static propTypes = {
    avatar: PropTypes.object.isRequired,
    blocks: PropTypes.array,
    cancelAction: PropTypes.func.isRequired,
    collection: PropTypes.object.isRequired,
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
    isNavbarHidden: PropTypes.bool,
    order: PropTypes.array.isRequired,
    pathname: PropTypes.string.isRequired,
    postId: PropTypes.string,
    repostContent: PropTypes.array,
    shouldLoadFromState: PropTypes.bool,
    shouldPersist: PropTypes.bool,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string,
  }

  static defaultProps = {
    blocks: [],
    editorStore: {},
    isComment: false,
    repostContent: [],
    shouldLoadFromState: false,
    shouldPersist: false,
    submitText: 'Post',
  }

  componentWillMount() {
    const { blocks, repostContent, shouldLoadFromState } = this.props
    this.state = {
      hideTextTools: true,
      hasDragOver: false,
    }
    this.uid = 0

    if (repostContent.length) {
      this.add({ kind: 'repost', data: repostContent })
    }
    if (blocks.length) {
      for (const block of blocks) {
        this.add(block, false)
      }
    } else if (shouldLoadFromState) {
      this.state = { hideTextTools: true }
      // was setting the collection/order previously
    }
  }

  componentDidMount() {
    const { editorId } = this.props
    this.dragObject = { component: this, dragId: editorId }
    addDragObject(this.dragObject)
    addInputObject(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
  }

  // componentWillReceiveProps(nextProps) {
  //   const { dispatch, editorId, editorStore } = nextProps
  //   const { collection, loadingImageBlocks } = this.state
  //   let newBlock = null
  //   let loadedContentData = null
  //   switch (editorStore.type) {
  //     // case ACTION_TYPES.EDITOR.APPEND_TEXT:
  //     //   if (editorStore.appendText && editorStore.appendText.length) {
  //     //     this.appendText(editorStore.appendText)
  //     //     dispatch({ type: ACTION_TYPES.EDITOR.CLEAR_APPENDED_TEXT, payload: { editorId } })
  //     //     this.scrollToLastTextBlock()
  //     //   }
  //     //   break
  //     case ACTION_TYPES.POST.TMP_IMAGE_CREATED:
  //       this.removeEmptyTextBlock()
  //       newBlock = this.add({
  //         kind: 'image',
  //         data: { url: editorStore.loadedContent[editorStore.index].url },
  //         index: editorStore.index,
  //       })
  //       // dispatch({
  //       //   type: ACTION_TYPES.POST.IMAGE_BLOCK_CREATED,
  //       //   payload: {
  //       //     editorId,
  //       //     uid: newBlock.uid,
  //       //     index: editorStore.index,
  //       //   },
  //       // })
  //       // we have one that is uploading to s3
  //       loadingImageBlocks.push(newBlock.uid)
  //       this.setState({ loadingImageBlocks })
  //       break
  //     case ACTION_TYPES.POST.SAVE_IMAGE_SUCCESS:
  //       loadedContentData = editorStore.loadedContent[editorStore.index]
  //       newBlock = this.getBlockFromUid(loadedContentData.uid)
  //       // the kind should only be 'block' when it is
  //       // dragBlock's placeholder so update it's data
  //       if (newBlock) {
  //         if (newBlock.kind === 'block') {
  //           this.dragBlock = {
  //             kind: 'image',
  //             data: {
  //               url: loadedContentData.url,
  //             },
  //             uid: loadedContentData.uid,
  //           }
  //         } else {
  //           collection[loadedContentData.uid] = {
  //             kind: 'image',
  //             data: {
  //               url: loadedContentData.url,
  //             },
  //             uid: loadedContentData.uid,
  //           }
  //           this.setState({ collection })
  //           this.persistBlocks()
  //           this.removeUploadIndicator(loadedContentData.uid)
  //         }
  //       }
  //       break
  //     case ACTION_TYPES.POST.POST_PREVIEW_SUCCESS:
  //       this.removeEmptyTextBlock()
  //       this.add({ ...editorStore.loadedContent[editorStore.index].postPreviews.body[0] })
  //       break
  //     default:
  //       break
  //   }
  // }

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
    if (this.dragObject) {
      removeDragObject(this.dragObject)
    }
    removeInputObject(this)
  }

  onCloseOmnibar() {
    const { dispatch, isComment } = this.props
    if (!isComment) {
      dispatch(closeOmnibar())
    }
  }

  onDragStart(props) {
    const { collection, dispatch, editorId } = this.props
    this.blockNode = props.target.parentNode.parentNode
    this.startOffset = this.blockNode.offsetTop
    this.startHeight = this.blockNode.offsetHeight
    this.prevBlock = this.blockNode.previousSibling
    this.nextBlock = this.blockNode.nextSibling
    const dragUid = this.blockNode.dataset.collectionId
    this.dragBlock = collection[dragUid]
    // swap the dragging block for a
    // normal block and set the height/width
    const block = {
      data: {
        width: this.blockNode.offsetWidth,
        height: this.blockNode.offsetHeight,
      },
      kind: 'block',
      uid: this.dragBlock.uid,
    }
    dispatch(updateDragBlock(block, dragUid, editorId))
    this.onDragMove(props)
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
    const { dispatch, editorId } = this.props
    dispatch(reorderBlocks(this.dragBlock.uid, delta, editorId))
    const placeholder = this.refs.blockPlaceholder.refs.editorBlock
    // update prev/next blocks
    this.prevBlock = placeholder.previousSibling
    this.nextBlock = placeholder.nextSibling
  }

  onDragEnd() {
    const { dispatch, editorId } = this.props
    // swap the normal block out for
    // the one that was removed initially
    const dragUid = this.dragBlock.uid
    dispatch(updateDragBlock(this.dragBlock, dragUid, editorId))
    // order matters here so the dragBlock gets removed
    ReactDOM.findDOMNode(document.body).classList.remove('isDragging')
    this.dragBlock = null
    this.setState({ dragBlockTop: null })
    // this.addEmptyTextBlock(true)
  }

  onDragOver = (e) => {
    e.preventDefault()
    if (!this.state.hasDragOver) {
      this.setState({ hasDragOver: true })
    }
  }

  onDragLeave = () => {
    if (this.state.hasDragOver) {
      this.setState({ hasDragOver: false })
    }
  }

  onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ hasDragOver: false })
    if (e.dataTransfer.files.length) { this.acceptFiles(e.dataTransfer.files) }
    // TODO: this is the implementation from the current
    // mothership. it may need to be updated to work
    // better with the webapp
    if (e.dataTransfer.types.indexOf('application/json') > -1) {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.username) {
        this.appendText(`@${data.username} `)
      }
      if (data.emojiCode) {
        this.appendText(`${data.emojiCode} `)
      }
      if (data.imgSrc) {
        this.appendText(`![img-drop](${data.imgSrc})\n\n`)
      }
      if (data.href) {
        if (data.href === data.linkText) {
          this.appendText(`${data.href}`)
        } else {
          this.appendText(`[${data.linkText}](${data.href}) `)
        }
      }
    }
  }

  onSubmitPost() {
    const { editorId } = this.props
    if (document.activeElement.parentNode.dataset.editorId === editorId) {
      this.submit()
    }
  }

  onInsertEmoji = ({ value }) => {
    this.appendText(value)
  }

  getBlockFromUid(uid) {
    const { collection } = this.props
    return collection[uid]
  }

  getBlockElement(block) {
    const { editorId } = this.props
    const isUploading = block.isLoading
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
            shouldAutofocus={ this.shouldAutofocus() }
          />
        )
      default:
        return null
    }
  }

  isElementInViewport(el, topOffset = 0) {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= topOffset && rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  scrollToLastTextBlock() {
    const { editorId, isNavbarHidden } = this.props
    const textBlocks = document.querySelectorAll(`[data-editor-id='${editorId}'] div.text`)
    const lastTextBlock = textBlocks[textBlocks.length - 1]
    if (lastTextBlock && !this.isElementInViewport(lastTextBlock, isNavbarHidden ? 0 : 80)) {
      const pos = lastTextBlock.getBoundingClientRect()
      scrollToTop(window.scrollY + (pos.top - 100))
    }
  }

  shouldAutofocus() {
    const { pathname, isComment } = this.props
    const postRegex = /^\/[\w\-]+\/post\/.+/
    return !(isComment && postRegex.test(pathname))
  }

  // TODO: probably should have the completer
  // dispatch an action that updates the gui
  // and then we can listen to that instead
  // of brute forcing it with dom lookups
  updateTextCollectionData() {
    const { editorId, collection, order } = this.props
    for (const uid of order) {
      const block = collection[uid]
      if (block && block.kind === 'text') {
        const selector = `[data-editor-id="${editorId}"][data-collection-id="${uid}"]`
        const elem = document.querySelector(selector)
        if (elem && elem.firstChild) {
          block.data = elem.firstChild.innerHTML
        }
      }
    }
    // this.setState({ collection })
  }

  add(block, shouldCheckForEmpty = true) {
    const newBlock = { ...block, uid: this.uid }
    const { collection, order } = this.props
    collection[this.uid] = newBlock
    order.push(this.uid)
    this.uid++
    // order matters here
    // this.setState({ collection, order })
    if (shouldCheckForEmpty) {
      // this.addEmptyTextBlock()
    }
    // this.persistBlocks()
    return newBlock
  }

  // addEmptyTextBlock(shouldCheckForEmpty = false) {
  //   const { collection, order } = this.state
  //   if (order.length > 1) {
  //     const last = collection[order[order.length - 1]]
  //     const secondToLast = collection[order[order.length - 2]]
  //     if (secondToLast.kind === 'text' &&
  //         last.kind === 'text' && !last.data.length) {
  //       this.remove(last.uid, shouldCheckForEmpty)
  //       return
  //     }
  //   }
  //   if (!order.length ||
  //       this.getBlockFromUid(order[order.length - 1]).kind !== 'text') {
  //     this.add({ kind: 'text', data: '' }, false)
  //   }
  // }

  appendText = (content) => {
    const { dispatch, editorId } = this.props
    dispatch({ type: ACTION_TYPES.EDITOR.APPEND_TEXT, payload: { editorId, text: content } })
  }

  remove = (uid, shouldCheckForEmpty = true) => {
    const { collection, order } = this.props
    delete collection[uid]
    order.splice(order.indexOf(uid), 1)
    // order matters here
    // this.setState({ collection, order })
    if (shouldCheckForEmpty) {
      // this.addEmptyTextBlock()
    }
    // this.persistBlocks()
  }

  // persistBlocks() {
  //   const { dispatch, collection, order, editorId, shouldPersist } = this.props
  //   if (!shouldPersist) { return }
  //   dispatch({
  //     type: ACTION_TYPES.POST.PERSIST,
  //     payload: {
  //       collection,
  //       editorId,
  //       order,
  //     },
  //   })
  // }

  removeEmptyTextBlock() {
    const { order } = this.props
    if (order.length > 0) {
      const last = this.getBlockFromUid(order[order.length - 1])
      if (last && last.kind === 'text' && !last.data.length) {
        this.remove(last.uid, false)
      }
    }
  }

  handleTextBlockInput = (vo) => {
    const { collection } = this.props
    collection[vo.uid] = vo
    // this.setState({ collection })
    // this.persistBlocks()
  }

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
  }

  submit = () => {
    const { isComment, submitAction } = this.props
    const data = this.serialize()
    // For whatever reason this needs to happen in a rAF otherwise we end up
    // with an editor with a collection of 1 but no editor blocks in the DOM?
    // This also seems to scoot around the `setState` error.
    if (isComment) {
      requestAnimationFrame(() => {
        this.clearBlocks()
        submitAction(data)
      })
    } else {
      submitAction(data)
    }
  }

  clearBlocks = () => {
    // this.setState({ collection: {}, order: [] })
    this.uid = 0
    // this.addEmptyTextBlock()
  }

  serialize() {
    const { order } = this.props
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
    const { order } = this.props
    for (const uid of order) {
      const block = this.getBlockFromUid(uid)
      if (block && block.kind === 'text' && block.data.match(userRegex)) {
        return true
      }
    }
    return false
  }

  hasContent() {
    const { order } = this.props
    const firstBlock = this.getBlockFromUid(order[0])
    if (!firstBlock) { return false }
    return (
      order.length > 1 ||
      firstBlock &&
      firstBlock.data.length &&
      firstBlock.data !== '<br>'
    )
  }

  handleFiles = (e) => {
    if (e.target.files.length) { this.acceptFiles(e.target.files) }
  }

  acceptFiles(files) {
    const { dispatch, editorId } = this.props
    for (let index = 0, len = files.length; index < len; index += 1) {
      // This guard may not be necessary
      if (files.item(index)) {
        // need to delay a bit or else the images clobber each other
        delay(dispatch, 100 * index, saveAsset(files[index], editorId))
      }
    }
  }

  render() {
    const { avatar, cancelAction, collection, editorId,
      isComment, isOwnPost, order, submitText } = this.props
    const { dragBlockTop, hasDragOver } = this.state
    const hasMention = this.hasMention()
    const hasContent = this.hasContent()
    const firstBlockIsText = this.getBlockFromUid(order[0]) ?
      this.getBlockFromUid(order[0]).kind === 'text' : true
    const showQuickEmoji = isComment && firstBlockIsText
    const editorClassNames = classNames('editor', {
      withQuickEmoji: showQuickEmoji,
      hasDragOver,
      hasMention,
      hasContent,
      isComment,
    })
    // TODO: hook up isSubmitDisabled for disable action
    // loadingImageBlocks.length > 0 ||
    return (
      <div
        className={ editorClassNames }
        data-placeholder="Say Ello..."
        onDragLeave={ this.onDragLeave }
        onDragOver={ this.onDragOver }
        onDrop={ this.onDrop }
      >
        { isComment ? <Avatar sources={ avatar } /> : null }
        <div
          className="editor-region"
          data-num-blocks={ order.length }
        >
          { order.map((uid) => this.getBlockElement(collection[uid])) }
          { this.dragBlock ?
            <div className="DragBlock" style={{ top: dragBlockTop }}>
              { this.getBlockElement(this.dragBlock) }
            </div> :
            null
          }
        </div>
        { showQuickEmoji ? <QuickEmoji onAddEmoji={ this.onInsertEmoji } /> : null }
        <PostActionBar
          cancelAction={ cancelAction }
          disableSubmitAction={ !hasContent }
          editorId={ editorId }
          handleFileAction={ this.handleFiles }
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
  const editor = state.editor[ownProps.editorId]
  return {
    avatar: state.profile.avatar,
    completions: state.editor.completions,
    collection: editor.collection,
    dataKey: editor.dataKey,
    order: editor.order,
    hasContent: editor.hasContent,
    orderLength: editor.order.length,
    emoji: state.emoji,
    isNavbarHidden: state.gui.isNavbarHidden,
    postId: ownProps.post ? `${ownProps.post.id}` : null,
    pathname: state.routing.location.pathname,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(BlockCollection)

