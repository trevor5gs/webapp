export function stream(state = {}, action = { type: '' }) {
  if (action.type.indexOf('LOAD_STREAM') === 0 ||
      action.type.indexOf('LOAD_NEXT_CONTENT') === 0 ||
      (action.type.indexOf('POST.') === 0 && action.type.indexOf('SUCCESS') > -1)) {
    return {
      ...state,
      error: action.error,
      meta: action.meta,
      payload: action.payload,
      type: action.type,
    }
  }
  return state
}

