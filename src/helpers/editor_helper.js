/* eslint-disable no-param-reassign */

export default class EditorHelper {

  add({ block, shouldCheckForEmpty = true, state }) {
    const newState = { ...state }
    const { collection, order } = newState
    newState.uid++
    collection[newState.uid] = { ...block, uid: newState.uid }
    order.push(newState.uid)
    if (shouldCheckForEmpty) { return this.addEmptyTextBlock(newState) }
    return newState
  }

  addEmptyTextBlock(state, shouldCheckForEmpty = false) {
    let newState = { ...state }
    const { collection, order } = newState
    if (order && order.length > 1) {
      const last = collection[order[order.length - 1]]
      const secondToLast = collection[order[order.length - 2]]
      // debugger
      if (secondToLast.kind === 'text' && last.kind === 'text' && last.data && !last.data.length) {
        return this.remove({ shouldCheckForEmpty, state: newState, uid: last.uid })
      }
    }
    if (order && !order.length || collection[order[order.length - 1]].kind !== 'text') {
      newState = this.add({ block: { data: '', kind: 'text' }, state: newState })
    }
    return newState
  }

  remove({ shouldCheckForEmpty = true, state, uid }) {
    const newState = { ...state }
    const { collection, order } = newState
    delete collection[uid]
    order.splice(order.indexOf(uid), 1)
    if (shouldCheckForEmpty) { return this.addEmptyTextBlock(newState) }
    return newState
  }

  removeEmptyTextBlock(state) {
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

}

