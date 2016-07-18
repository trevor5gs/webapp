import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { get, isEqual } from 'lodash'
import Avatar from '../assets/Avatar'
import Block from './Block'
import EmbedBlock from './EmbedBlock'
import ImageBlock from './ImageBlock'
import QuickEmoji from './QuickEmoji'
import RepostBlock from './RepostBlock'
import TextBlock from './TextBlock'
import PostActionBar from './PostActionBar'
import {
  addBlock,
  addDragBlock,
  addEmptyTextBlock,
  loadReplyAll,
  removeBlock,
  removeDragBlock,
  reorderBlocks,
  saveAsset,
  updateBlock,
} from '../../actions/editor'
import { closeOmnibar } from '../../actions/omnibar'
import { scrollToLastTextBlock } from '../../vendor/scrolling'
import * as ACTION_TYPES from '../../constants/action_types'
import { addDragObject, removeDragObject } from './DragComponent'
import { addInputObject, removeInputObject } from './InputComponent'

class BlockCollection extends Component {

  static propTypes = {
    affiliateLink: PropTypes.string,
    avatar: PropTypes.object,
    blocks: PropTypes.array,
    cancelAction: PropTypes.func.isRequired,
    currentUsername: PropTypes.string,
    collection: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    dragBlock: PropTypes.object,
    editorId: PropTypes.string.isRequired,
    hasContent: PropTypes.bool,
    hasMedia: PropTypes.bool,
    hasMention: PropTypes.bool,
    isComment: PropTypes.bool,
    isLoading: PropTypes.bool,
    isPosting: PropTypes.bool,
    isMobileGridStream: PropTypes.bool,
    isOwnPost: PropTypes.bool,
    isNavbarHidden: PropTypes.bool,
    order: PropTypes.array,
    pathname: PropTypes.string.isRequired,
    postId: PropTypes.string,
    repostContent: PropTypes.array,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string,
  }

  static defaultProps = {
    blocks: [],
    isComment: false,
    repostContent: [],
    submitText: 'Post',
  }

  componentWillMount() {
    const { blocks, dispatch, editorId, repostContent } = this.props
    this.state = { hasDragOver: false }
    if (repostContent.length) {
      dispatch(addBlock({ kind: 'repost', data: repostContent }, editorId))
    }
    if (blocks.length) {
      for (const block of blocks) {
        dispatch(addBlock(block, editorId, false))
      }
    }
  }

  componentDidMount() {
    const { dispatch, editorId } = this.props
    this.dragObject = { component: this, dragId: editorId }
    dispatch(addEmptyTextBlock(editorId))
    addDragObject(this.dragObject)
    addInputObject(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.collection || !nextProps.order) { return false }
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
  }

  componentWillUnmount() {
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
    dispatch(addDragBlock(collection[dragUid], editorId))
    // swap the dragging block for a
    // normal block and set the height/width
    const block = {
      data: {
        width: this.blockNode.offsetWidth,
        height: this.blockNode.offsetHeight,
      },
      kind: 'block',
      uid: collection[dragUid].uid,
    }
    dispatch(updateBlock(block, dragUid, editorId, true))
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
    const { dispatch, dragBlock, editorId } = this.props
    dispatch(reorderBlocks(dragBlock.uid, delta, editorId))
    const placeholder = this.refs.blockPlaceholder.refs.editorBlock
    this.prevBlock = placeholder.previousSibling
    this.nextBlock = placeholder.nextSibling
  }

  onDragEnd() {
    const { dispatch, dragBlock, editorId } = this.props
    // swap the normal block out for
    // the one that was removed initially
    const dragUid = dragBlock.uid
    dispatch(updateBlock(dragBlock, dragUid, editorId))
    dispatch(removeDragBlock(editorId))
    ReactDOM.findDOMNode(document.body).classList.remove('isDragging')
    this.setState({ dragBlockTop: null })
    dispatch(addEmptyTextBlock(editorId))
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
    const { collection, editorId, hasContent } = this.props
    if (document.activeElement.parentNode.dataset.editorId === editorId &&
        !Object.values(collection).some((block) => block.isLoading) && hasContent) {
      this.submit()
    }
  }

  onInsertEmoji = ({ value }) => {
    this.appendText(value)
  }

  getBlockElement(block) {
    const { editorId } = this.props
    const blockProps = {
      data: block.data,
      editorId,
      key: block.uid,
      kind: block.kind,
      onRemoveBlock: this.remove,
      uid: block.uid,
    }
    switch (block.kind) {
      case 'block':
        return (
          <Block
            {...blockProps}
            className={classNames('BlockPlaceholder', { isUploading: block.isLoading })}
            ref="blockPlaceholder"
          >
            <div style={{ width: block.data.width, height: block.data.height }} />
          </Block>
        )
      case 'affiliate_embed':
      case 'embed':
        return (
          <EmbedBlock {...blockProps} />
        )
      case 'affiliate_image':
      case 'image':
        return (
          <ImageBlock blob={block.blob} {...blockProps} isUploading={block.isLoading} />
        )
      case 'repost':
        return (
          <RepostBlock {...blockProps} onRemoveBlock={null} />
        )
      case 'affiliate_text':
      case 'text':
        return (
          <TextBlock
            {...blockProps}
            onInput={this.handleTextBlockInput}
            shouldAutofocus={this.shouldAutofocus()}
          />
        )
      default:
        return null
    }
  }

  shouldAutofocus() {
    const { pathname, isComment } = this.props
    const postRegex = /^\/[\w\-]+\/post\/.+/
    return !(isComment && postRegex.test(pathname))
  }

  appendText = (content) => {
    const { dispatch, editorId, isNavbarHidden } = this.props
    dispatch({ type: ACTION_TYPES.EDITOR.APPEND_TEXT, payload: { editorId, text: content } })
    scrollToLastTextBlock(editorId, isNavbarHidden)
  }

  remove = (uid) => {
    const { dispatch, editorId } = this.props
    dispatch(removeBlock(uid, editorId))
  }

  handleTextBlockInput = (vo) => {
    const { collection, dispatch, editorId } = this.props
    if (!isEqual(collection[vo.uid], vo)) {
      dispatch(updateBlock(vo, vo.uid, editorId))
    }
  }

  replyAll = () => {
    const { dispatch, postId, editorId } = this.props
    dispatch(loadReplyAll(postId, editorId))
  }

  submit = () => {
    const { submitAction } = this.props
    const data = this.serialize()
    submitAction(data)
  }

  serialize() {
    const { collection, order } = this.props
    const results = []
    for (const uid of order) {
      const block = collection[uid]
      if (/affiliate_/.test(block.kind)) {
        switch (block.kind) {
          case 'affiliate_text':
            if (block.data.length) {
              results.push({ kind: block.kind, data: block.data, link_url: block.link_url })
            }
            break
          default:
            results.push({ kind: block.kind, data: block.data, link_url: block.link_url })
            break
        }
      } else {
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
    }
    return results
  }

  handleFiles = (e) => {
    if (e.target.files.length) { this.acceptFiles(e.target.files) }
  }

  acceptFiles(files) {
    const { dispatch, editorId } = this.props
    for (let index = 0, len = files.length; index < len; index += 1) {
      if (files.item(index)) {
        dispatch(saveAsset(files[index], editorId))
      }
    }
  }

  render() {
    const {
      affiliateLink, avatar, cancelAction, collection, dragBlock, editorId, hasContent, hasMedia,
      hasMention, isComment, isLoading, isMobileGridStream, isOwnPost, isPosting, order, submitText,
    } = this.props
    const { dragBlockTop, hasDragOver } = this.state
    const firstBlockIsText = collection[order[0]] ? /text/.test(collection[order[0]].kind) : true
    const showQuickEmoji = isComment && firstBlockIsText
    const editorClassNames = classNames('editor', {
      withQuickEmoji: showQuickEmoji,
      hasDragOver,
      hasContent,
      hasMedia,
      hasMention,
      isComment,
      isLoading,
      isPosting,
    })
    return (
      <div
        className={editorClassNames}
        data-placeholder="Say Ello..."
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        {isComment ? <Avatar sources={avatar} /> : null}
        <div
          className="editor-region"
          data-num-blocks={order.length}
        >
          {order.map((uid) => this.getBlockElement(collection[uid]))}
          {dragBlock ?
            <div className="DragBlock" style={{ top: dragBlockTop }}>
              {this.getBlockElement(dragBlock)}
            </div> :
            null
          }
        </div>
        {showQuickEmoji ? <QuickEmoji onAddEmoji={this.onInsertEmoji} /> : null}
        <PostActionBar
          affiliateLink={affiliateLink}
          cancelAction={cancelAction}
          disableSubmitAction={isPosting || isLoading || !hasContent}
          editorId={editorId}
          handleFileAction={this.handleFiles}
          hasMedia={hasMedia}
          ref="postActionBar"
          replyAllAction={isComment && isOwnPost && !isMobileGridStream ? this.replyAll : null}
          submitAction={this.submit}
          submitText={submitText}
        />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const editor = get(state, ['editor', ownProps.editorId], {})
  return {
    affiliateLink: get(editor, ['collection', editor.order[0], 'link_url']),
    avatar: state.profile.avatar,
    collection: editor.collection,
    currentUsername: state.profile.username,
    dragBlock: editor.dragBlock,
    hasContent: editor.hasContent,
    hasMedia: editor.hasMedia,
    hasMention: editor.hasMention,
    isLoading: editor.isLoading,
    isPosting: editor.isPosting,
    isMobileGridStream: state.gui.deviceSize === 'mobile' && state.gui.isGridMode,
    isNavbarHidden: state.gui.isNavbarHidden,
    order: editor.order,
    orderLength: get(editor, 'order.length'),
    pathname: state.routing.location.pathname,
    postId: get(ownProps, 'post.id'),
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(BlockCollection)

