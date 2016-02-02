import React, { Component, PropTypes } from 'react'
import EmbedBlock from './EmbedBlock'
import ImageBlock from './ImageBlock'
import TextBlock from './TextBlock'
import * as ACTION_TYPES from '../../../constants/action_types'

const BLOCK_KEY = 'block'
const SORTABLE_KEY = 'sortable'
const UID_KEY = 'uid'

class BlockCollection extends Component {

  static propTypes = {
    blocks: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    editorStore: PropTypes.object.isRequired,
  };

  static defaultProps = {
    blocks: [],
  };

  componentWillMount() {
    this.state = { collection: {}, order: [] }
    this.uid = 0
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
        this.add({ ...editorStore.postPreviews.body[0] })
        break
      default:
        break
    }
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

  addSortable(uid, sortable) {
    const { collection } = this.state
    if (!collection[uid] || collection[uid][SORTABLE_KEY]) {
      return false
    }
    collection[uid][SORTABLE_KEY] = sortable
    // sortable.uid = uid
    // sortable.collection = this
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

  handleChange = (vo) => {
    const { collection } = this.state
    collection[vo.uid][BLOCK_KEY] = vo
    this.setState({ collection })
  };

  render() {
    const { collection, order } = this.state
    const blocks = []
    for (const uid of order) {
      const block = collection[uid][BLOCK_KEY]
      switch (block.kind) {
        case 'text':
          blocks.push(
            <TextBlock
              data={ block.data }
              key={ uid }
              kind={ block.kind }
              onChange={ this.handleChange }
              onRemoveBlock={ this.remove }
              ref={ `block_${block.uid}` }
              uid={ block.uid }
            />
          )
          break
        case 'image':
          blocks.push(
            <ImageBlock
              data={ block.data }
              key={ uid }
              kind={ block.kind }
              onRemoveBlock={ this.remove }
              ref={ `block_${block.uid}` }
              uid={ block.uid }
            />
          )
          break
        case 'embed':
          blocks.push(
            <EmbedBlock
              data={ block.data }
              key={ uid }
              kind={ block.kind }
              onRemoveBlock={ this.remove }
              ref={ `block_${block.uid}` }
              uid={ block.uid }
            />
          )
          break
        default:
          blocks.push(null)
          break
      }
    }
    return (
      <div
        className="editor-region"
        data-num-blocks={ order.length }
      >
        { blocks }
      </div>
    )
  }

}

export default BlockCollection

