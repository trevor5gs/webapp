import { AUTHENTICATION, PROFILE } from '../constants/action_types'

export function stream(state = {}, action = { type: '' }) {
  if (action.type === AUTHENTICATION.LOGOUT || action.type === PROFILE.DELETE_SUCCESS) {
    return {}
  } else if (action && action.meta && action.meta.updateResult === false) {
    return state
  } else if (action.type.indexOf('LOAD_STREAM') === 0 ||
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

