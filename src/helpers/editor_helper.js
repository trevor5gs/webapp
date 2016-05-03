/* eslint-disable no-param-reassign */

const methods = {}

function _addDataKey(state) {
  const newState = { ...state }
  const { collection, order } = newState
  let dataKey = ''
  for (const key in collection) {
    if (collection.hasOwnProperty(key)) {
      dataKey += JSON.stringify(collection[key].data)
    }
  }
  newState.dataKey = dataKey + order.join('')
  return newState
}
methods.addDataKey = _addDataKey

function _addHasContent(state) {
  const newState = { ...state }
  const { collection, order } = newState
  const firstBlock = collection[order[0]]
  if (!firstBlock) { return false }
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

function _add({ block, shouldCheckForEmpty = true, state }) {
  const newState = { ...state }
  const { collection, order } = newState
  newState.uid++
  collection[newState.uid] = { ...block, uid: newState.uid }
  order.push(newState.uid)
  if (shouldCheckForEmpty) { return methods.addEmptyTextBlock(newState) }
  return newState
}
methods.add = _add

function _addEmptyTextBlock(state, shouldCheckForEmpty = false) {
  let newState = { ...state }
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
  const newState = { ...state }
  const { collection, order } = newState
  delete collection[uid]
  order.splice(order.indexOf(uid), 1)
  if (shouldCheckForEmpty) { return methods.addEmptyTextBlock(newState) }
  return newState
}
methods.remove = _remove

function _removeEmptyTextBlock(state) {
  const newState = { ...state }
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

function _updateBlock(newState, action) {
  const { block, uid } = action.payload
  newState.collection[uid] = block
  return newState
}
methods.updateBlock = _updateBlock

function _reorderBlocks(newState, action) {
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

export default methods

