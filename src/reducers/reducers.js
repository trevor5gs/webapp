export function stream(state = {}, action) {
  if (action.type.indexOf('LOAD_STREAM') === -1) {
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

export function staticPage(state = {}, action) {
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

