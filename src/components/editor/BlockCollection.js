import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { debounce } from 'lodash'
import Block from './Block'
import EmbedBlock from './EmbedBlock'
import ImageBlock from './ImageBlock'
import TextBlock from './TextBlock'
import PostActionBar from './PostActionBar'
import TextTools from './TextTools'
import { autoCompleteUsers, loadEmojis } from '../../actions/posts'
import * as ACTION_TYPES from '../../constants/action_types'
import { addDragObject, removeDragObject } from './DragComponent'
import { addInputObject, removeInputObject } from './InputComponent'
import { replaceWordFromSelection } from './SelectionUtil'
import Completer, { userRegex } from '../completers/Completer'

const BLOCK_KEY = 'block'
const UID_KEY = 'uid'

class BlockCollection extends Component {

  static propTypes = {
    blocks: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    editorStore: PropTypes.object.isRequired,
    emoji: PropTypes.object.isRequired,
    shouldPersist: PropTypes.bool,
    cancelAction: PropTypes.func.isRequired,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string,
  };

  static defaultProps = {
    blocks: [],
    shouldPersist: false,
    submitText: 'Post',
  };

  componentWillMount() {
    const { blocks, editorStore } = this.props
    this.onHideCompleter()
    this.state = {
      collection: {},
      hideTextTools: true,
      order: [],
    }
    this.uid = 0
    if (blocks.length) {
      for (const block of blocks) {
        this.add(block, false)
      }
    } else if (editorStore.editorState) {
      this.state = { ...editorStore.editorState, hideTextTools: true }
      this.uid = Math.max(...editorStore.editorState.order) + 1
    }
    this.onUserCompleter = debounce(this.onUserCompleter, 300)
    this.persistBlocks = debounce(this.persistBlocks, 300)
    addDragObject(this)
    addInputObject(this)
  }

  componentDidMount() {
    this.addEmptyTextBlock()
    this.setSelectionOnMount()
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, editorStore } = nextProps
    const { collection } = this.state
    let newBlock
    switch (editorStore.type) {
      case ACTION_TYPES.POST.TMP_IMAGE_CREATED:
        this.removeEmptyTextBlock()
        newBlock = this.add({ kind: 'image', data: { url: editorStore.url } })
        dispatch({ type: ACTION_TYPES.POST.IMAGE_BLOCK_CREATED, payload: { uid: newBlock.uid } })
        break
      case ACTION_TYPES.POST.SAVE_IMAGE_SUCCESS:
        collection[editorStore.uid][BLOCK_KEY] = {
          kind: 'image',
          data: {
            url: editorStore.url,
          },
          uid: editorStore.uid,
        }
        this.setState({ collection })
        this.persistBlocks()
        break
      case ACTION_TYPES.POST.POST_PREVIEW_SUCCESS:
        this.removeEmptyTextBlock()
        this.add({ ...editorStore.postPreviews.body[0] })
        break
      default:
        break
    }
  }

  componentWillUnmount() {
    this.onHideCompleter()
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
    this.dragBlock = collection[dragUid][BLOCK_KEY]
    // swap the dragging block for a
    // normal block and set the height/width
    collection[dragUid][BLOCK_KEY] = {
      data: {
        width: this.blockNode.offsetWidth,
        height: this.blockNode.offsetHeight,
      },
      kind: 'block',
      uid: this.dragBlock.uid,
    }
    this.onDragMove(props)
    this.setState({ collection })
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
    collection[dragUid][BLOCK_KEY] = this.dragBlock
    // order matters here so the dragBlock gets removed
    this.dragBlock = null
    this.setState({ collection, dragBlockTop: null })
    this.addEmptyTextBlock(true)
  }

  onPositionChange(props) {
    this.setState(props)
  }

  onShowTextTools({ activeTools }) {
    this.setState({ hideTextTools: false, activeTools })
  }

  onHideTextTools() {
    this.setState({ hideTextTools: true })
  }

  onUserCompleter({ word }) {
    const { dispatch } = this.props
    dispatch(autoCompleteUsers('user', word))
  }

  onEmojiCompleter({ word }) {
    const { dispatch, emoji } = this.props
    if (emoji.emojis && emoji.emojis.length) {
      dispatch({
        type: ACTION_TYPES.EMOJI.LOAD_SUCCESS,
        payload: {
          response: {
            emojis: emoji.emojis,
          },
          type: 'emoji',
          word,
        },
      })
    } else {
      dispatch(loadEmojis('emoji', word))
    }
  }

  onHideCompleter() {
    const { dispatch, editorStore } = this.props
    if (editorStore.completions) {
      dispatch({ type: ACTION_TYPES.POST.AUTO_COMPLETE_CLEAR })
    }
  }

  onSubmitPost() {
    this.submit()
  }

  getBlockElement(block) {
    const blockProps = {
      data: block.data,
      key: block.uid,
      kind: block.kind,
      onRemoveBlock: this.remove,
      ref: `block_${block.uid}`,
      uid: block.uid,
    }
    switch (block.kind) {
      case 'text':
        return (
          <TextBlock
            { ...blockProps }
            onInput={ this.handleTextBlockInput }
          />
        )
      case 'image':
        return (
          <ImageBlock { ...blockProps }/>
        )
      case 'embed':
        return (
          <EmbedBlock { ...blockProps }/>
        )
      case 'block':
        return (
          <Block { ...blockProps } className="BlockPlaceholder" ref="blockPlaceholder"/>
        )
      default:
        return null
    }
  }

  setSelectionOnMount() {
    if (this.hasContent()) { return }
    const element = document.querySelector('.editable.text')
    if (element) { element.focus() }
  }

  add(block, shouldCheckForEmpty = true) {
    const newBlock = { ...block, uid: this.uid }
    const { collection, order } = this.state
    const obj = {}
    obj[BLOCK_KEY] = newBlock
    obj[UID_KEY] = this.uid
    collection[this.uid] = obj
    order.push(this.uid)
    this.uid++
    // order matters here
    this.setState({ collection, order })
    if (shouldCheckForEmpty) {
      this.addEmptyTextBlock()
    }
    this.persistBlocks()
    return newBlock
  }

  addEmptyTextBlock(shouldCheckForEmpty = false) {
    const { collection, order } = this.state
    requestAnimationFrame(() => {
      if (order.length > 1) {
        const last = collection[order[order.length - 1]][BLOCK_KEY]
        const secondToLast = collection[order[order.length - 2]][BLOCK_KEY]
        if (secondToLast.kind === 'text' &&
            last.kind === 'text' && !last.data.length) {
          return this.remove(last.uid, shouldCheckForEmpty)
        }
      }
      if (!order.length || collection[order[order.length - 1]][BLOCK_KEY].kind !== 'text') {
        this.add({ kind: 'text', data: '' })
      }
    })
  }

  remove = (uid, shouldCheckForEmpty = true) => {
    const { collection, order } = this.state
    delete collection[uid]
    order.splice(order.indexOf(uid), 1)
    // order matters here
    this.setState({ collection, order })
    if (shouldCheckForEmpty) {
      this.addEmptyTextBlock()
    }
    this.persistBlocks()
  };

  persistBlocks() {
    const { dispatch, shouldPersist } = this.props
    if (!shouldPersist) { return }
    const { collection, order } = this.state
    dispatch({ type: ACTION_TYPES.POST.PERSIST, payload: { collection, order } })
  }

  removeEmptyTextBlock() {
    const { collection, order } = this.state
    if (order.length > 0) {
      const last = collection[order[order.length - 1]][BLOCK_KEY]
      if (last && last.kind === 'text' && !last.data.length) {
        this.remove(last.uid, false)
      }
    }
  }

  handleTextBlockInput = (vo) => {
    const { collection } = this.state
    collection[vo.uid][BLOCK_KEY] = vo
    this.persistBlocks()
  };

  submit = () => {
    const { dispatch, submitAction } = this.props
    const data = this.serialize()
    submitAction(data)
    dispatch({ type: ACTION_TYPES.POST.PERSIST, payload: null })
  };

  serialize() {
    const { collection, order } = this.state
    const results = []
    for (const uid of order) {
      const block = collection[uid][BLOCK_KEY]
      switch (block.kind) {
        case 'text':
          if (block.data.length) {
            results.push({ kind: block.kind, data: block.data })
          }
          break
        default:
          results.push({ kind: block.kind, data: block.data })
          break
      }
    }
    return results
  }

  handleCompletion = ({ value }) => {
    replaceWordFromSelection(value)
    this.handleCancelAutoCompleter()
    this.persistBlocks()
  };

  handleCancelAutoCompleter = () => {
    this.onHideCompleter()
    this.onHideTextTools()
    // TODO: maybe clear out the completions from the editor store
  };

  hasMention() {
    const { collection, order } = this.state
    for (const uid of order) {
      const block = collection[uid][BLOCK_KEY]
      if (block.kind === 'text' && block.data.match(userRegex)) {
        return true
      }
    }
    return false
  }

  hasContent() {
    const { collection, order } = this.state
    const firstBlock = collection[order[0]]
    return (
      order.length > 1 ||
      firstBlock &&
      firstBlock.block.data.length &&
      firstBlock.block.data !== '<br>'
    )
  }

  render() {
    const { cancelAction, editorStore, submitText } = this.props
    const { activeTools, collection, coordinates, dragBlockTop, hideTextTools, order } = this.state
    const hasMention = this.hasMention()
    const hasContent = this.hasContent()
    return (
      <div
        className={ classNames('editor', { hasMention, hasContent }) }
        data-placeholder="Say Ello..."
      >
        <div
          className="editor-region"
          data-num-blocks={ order.length }
        >
          { order.map((uid) => this.getBlockElement(collection[uid][BLOCK_KEY])) }
          { this.dragBlock ?
            <div className="DragBlock" style={{ top: dragBlockTop }}>
              { this.getBlockElement(this.dragBlock) }
            </div> :
            null
          }
          { editorStore.completions ?
            <Completer
              completions={ editorStore.completions }
              onCancel={ this.handleCancelAutoCompleter }
              onCompletion={ this.handleCompletion }
            /> :
            null
          }
        </div>
        { !hideTextTools ?
          <TextTools
            activeTools={ activeTools }
            isHidden={ hideTextTools }
            coordinates={ coordinates }
            key={ JSON.stringify(activeTools) }
          /> :
          null
        }
        <PostActionBar
          ref="postActionBar"
          cancelAction={ cancelAction }
          submitAction={ this.submit }
          submitText={ submitText }
        />
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    editorStore: state.editor,
    emoji: state.emoji,
  }
}

export default connect(mapStateToProps)(BlockCollection)

