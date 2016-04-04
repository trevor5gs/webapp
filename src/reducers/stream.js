import { AUTHENTICATION, POST, PROFILE } from '../constants/action_types'

export function stream(state = {}, action = { type: '' }) {
  if (action.type === AUTHENTICATION.LOGOUT || action.type === PROFILE.DELETE_SUCCESS) {
    return {}
  } else if (!(action.type === POST.DETAIL_FAILURE || action.type === PROFILE.DETAIL_FAILURE) &&
             !(action.type.indexOf('COMMENT.') === 0 && action.type.indexOf('SUCCESS') > -1) &&
             action && action.meta && action.meta.updateResult === false) {
    return state
  } else if (action.type === POST.DETAIL_FAILURE ||
             action.type === PROFILE.DETAIL_FAILURE ||
             action.type.indexOf('LOAD_STREAM_') === 0 ||
             action.type.indexOf('LOAD_NEXT_CONTENT_') === 0 ||
             (action.type.indexOf('COMMENT.') === 0 && action.type.indexOf('SUCCESS') > -1) ||
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

