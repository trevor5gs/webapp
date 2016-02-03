import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import EmbedBlock from './EmbedBlock'
import ImageBlock from './ImageBlock'
import TextBlock from './TextBlock'
import PostActionBar from './PostActionBar'
import * as ACTION_TYPES from '../../../constants/action_types'
import { addDragObject, removeDragObject } from './Draggable'

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

  onDragStart(e) {
    // swap the dragging block for a
    // normal block and set the height/width
    console.log('dragStart', e)
  }

  onDragMove(e) {
    // calculate delta and change the order
    // array to kick off a render
    console.log('dragMove', e)
  }

  onDragEnd(e) {
    // swap the normal block out for
    // the one that was removed initially
    console.log('dragEnd', e)
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

  addEmptyTextBlock() {
    const { collection, order } = this.state
    requestAnimationFrame(() => {
      if (order.length > 1) {
        const last = collection[order[order.length - 1]][BLOCK_KEY]
        const secondToLast = collection[order[order.length - 2]][BLOCK_KEY]
        if (secondToLast.kind === 'text' &&
            secondToLast.data.length &&
            last.kind === 'text' && !last.data.length) {
          return this.remove(last.uid, false)
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
    const { collection, order } = this.state
    const blocks = []
    for (const uid of order) {
      const block = collection[uid][BLOCK_KEY]
      const blockProps = {
        data: block.data,
        key: uid,
        kind: block.kind,
        onRemoveBlock: this.remove,
        ref: `block_${block.uid}`,
        uid: block.uid,
      }
      switch (block.kind) {
        case 'text':
          blocks.push(
            <TextBlock
              { ...blockProps }
              onInput={ this.handleTextBlockInput }
            />
          )
          break
        case 'image':
          blocks.push(
            <ImageBlock { ...blockProps }/>
          )
          break
        case 'embed':
          blocks.push(
            <EmbedBlock { ...blockProps }/>
          )
          break
        default:
          blocks.push(null)
          break
      }
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

