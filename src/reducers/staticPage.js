export function staticPage(state = {}, action = { type: '' }) {
  if (action.type.indexOf('STATIC_PAGE') === -1) {
    return state
  }
  return {
    ...state,
    error: action.error,
    meta: action.meta,
    payload: action.payload,
    type: action.type,
  }
}

