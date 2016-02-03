import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Block from './Block'
import EmbedBlock from './EmbedBlock'
import ImageBlock from './ImageBlock'
import TextBlock from './TextBlock'
import PostActionBar from './PostActionBar'
import * as ACTION_TYPES from '../../constants/action_types'
import { addDragObject, removeDragObject } from './DragComponent'

const BLOCK_KEY = 'block'
const UID_KEY = 'uid'

class BlockCollection extends Component {

  static propTypes = {
    blocks: PropTypes.array,
    delegate: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    editorStore: PropTypes.object.isRequired,
  };

  static defaultProps = {
    blocks: [],
  };

  componentWillMount() {
    this.state = { collection: {}, order: [] }
    this.uid = 0
    addDragObject(this)
  }

  componentDidMount() {
    const { blocks } = this.props
    for (const block of blocks) {
      this.add(block, false)
    }
    this.addEmptyTextBlock()
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, editorStore } = nextProps
    switch (editorStore.type) {
      case ACTION_TYPES.POST.TMP_IMAGE_CREATED:
        this.removeEmptyTextBlock()
        const newBlock = this.add({ kind: 'image', data: { url: editorStore.url } })
        dispatch({ type: ACTION_TYPES.POST.IMAGE_BLOCK_CREATED, payload: { uid: newBlock.uid } })
        break
      case ACTION_TYPES.POST.SAVE_IMAGE_SUCCESS:
        const { collection } = this.state
        collection[editorStore.uid][BLOCK_KEY] = {
          kind: 'image',
          data: {
            url: editorStore.url,
          },
          uid: editorStore.uid,
        }
        this.setState({ collection })
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
    removeDragObject(this)
  }

  // Drag Stuff

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
  };

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
    this.setState({ collection })
  };

  submit() {
    const { delegate } = this.props
    const data = this.serialize()
    delegate.submit(data)
  }

  serialize() {
    const { collection, order } = this.state
    const results = []
    for (const uid of order) {
      const block = collection[uid][BLOCK_KEY]
      results.push({ kind: block.kind, data: block.data })
    }
    return results
  }

  render() {
    const { collection, dragBlockTop, order } = this.state
    const blocks = []
    for (const uid of order) {
      const block = collection[uid][BLOCK_KEY]
      blocks.push(this.getBlockElement(block))
    }
    let dragElem = null
    if (this.dragBlock) {
      dragElem = (<div className="DragBlock" style={{ top: dragBlockTop }}>
          { this.getBlockElement(this.dragBlock) }
        </div>
      )
    }
    return (
      <div
        className="editor"
        data-placeholder="Say Ello..."
      >
        <div
          className="editor-region"
          data-num-blocks={ order.length }
        >
          { blocks }
          { dragElem }
        </div>
        <PostActionBar ref="postActionBar" editor={ this } />
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    editorStore: state.editor,
  }
}

export default connect(mapStateToProps)(BlockCollection)

