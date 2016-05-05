import { cloneDeep } from 'lodash'
import { userRegex } from '../components/completers/Completer'

const methods = {}

function _addHasContent(state) {
  const newState = cloneDeep(state)
  const { collection, order } = newState
  const firstBlock = collection[order[0]]
  if (!firstBlock) { return state }
  const hasContent = Boolean(
    order.length > 1 ||
    firstBlock &&
    firstBlock.data.length &&
    firstBlock.data !== '<br>'
  )
  newState.hasContent = hasContent
  return newState
}
methods.addHasContent = _addHasContent

function _addHasMention(state) {
  const newState = cloneDeep(state)
  const { collection, order } = newState
  let hasMention = false
  for (const uid of order) {
    const block = collection[uid]
    if (block && block.kind === 'text' && userRegex.test(block.data)) {
      hasMention = true
      break
    }
  }
  newState.hasMention = hasMention
  return newState
}
methods.addHasMention = _addHasMention

function _addIsLoading(state) {
  const newState = cloneDeep(state)
  const { collection } = newState
  let isLoading = false
  for (const uid in collection) {
    if (collection.hasOwnProperty(uid)) {
      const block = collection[uid]
      if (block && block.kind === 'image' && block.isLoading) {
        isLoading = true
        break
      }
    }
  }
  if (!isLoading && newState.dragBlock) { isLoading = newState.dragBlock.isLoading }
  newState.isLoading = isLoading
  return newState
}
methods.addIsLoading = _addIsLoading

function _add({ block, shouldCheckForEmpty = true, state }) {
  const newState = cloneDeep(state)
  const { collection, order } = newState
  collection[newState.uid] = { ...block, uid: newState.uid }
  order.push(newState.uid)
  newState.uid++
  if (shouldCheckForEmpty) { return methods.addEmptyTextBlock(newState) }
  return newState
}
methods.add = _add

function _addEmptyTextBlock(state, shouldCheckForEmpty = false) {
  let newState = cloneDeep(state)
  const { collection, order } = newState
  if (order.length > 1) {
    const last = collection[order[order.length - 1]]
    const secondToLast = collection[order[order.length - 2]]
    if (secondToLast.kind === 'text' && last.kind === 'text' && !last.data.length) {
      return methods.remove({ shouldCheckForEmpty, state: newState, uid: last.uid })
    }
  }
  if (!order.length || collection[order[order.length - 1]].kind !== 'text') {
    newState = methods.add({ block: { data: '', kind: 'text' }, state: newState })
  }
  return newState
}
methods.addEmptyTextBlock = _addEmptyTextBlock

function _remove({ shouldCheckForEmpty = true, state, uid }) {
  const newState = cloneDeep(state)
  const { collection, order } = newState
  delete collection[uid]
  order.splice(order.indexOf(uid), 1)
  if (shouldCheckForEmpty) { return methods.addEmptyTextBlock(newState) }
  return newState
}
methods.remove = _remove

function _removeEmptyTextBlock(state) {
  const newState = cloneDeep(state)
  const { collection, order } = newState
  if (order.length > 0) {
    const last = collection[order[order.length - 1]]
    if (last && last.kind === 'text' && !last.data.length) {
      delete collection[last.uid]
      order.splice(order.indexOf(last.uid), 1)
    }
  }
  return newState
}
methods.removeEmptyTextBlock = _removeEmptyTextBlock

function _updateBlock(state, action) {
  const newState = cloneDeep(state)
  const { block, uid } = action.payload
  newState.collection[uid] = block
  return newState
}
methods.updateBlock = _updateBlock

function _reorderBlocks(state, action) {
  const newState = cloneDeep(state)
  const { order } = newState
  const { delta, uid } = action.payload
  const index = order.indexOf(uid)
  // remove from old spot
  order.splice(index, 1)
  // add to new spot
  order.splice(index + delta, 0, uid)
  return newState
}
methods.reorderBlocks = _reorderBlocks

function _appendText(state, text) {
  const newState = cloneDeep(state)
  const { collection, order } = newState
  const textBlocks = order.filter((orderUid) => collection[orderUid].kind === 'text')
  const lastTextBlock = collection[textBlocks[textBlocks.length - 1]]
  if (lastTextBlock) {
    lastTextBlock.data += text
    collection[lastTextBlock.uid] = lastTextBlock
  }
  return newState
}
methods.appendText = _appendText

function _replaceText(state, action) {
  const newState = cloneDeep(state)
  const { collection } = newState
  const { editorId, uid } = action.payload
  if (collection[uid].kind === 'text') {
    const selector = `[data-editor-id="${editorId}"][data-collection-id="${uid}"]`
    const elem = document.querySelector(selector)
    if (elem && elem.firstChild) {
      collection[uid].data = elem.firstChild.innerHTML
    }
  }
  return newState
}
methods.replaceText = _replaceText

export default methods

