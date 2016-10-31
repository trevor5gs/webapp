import get from 'lodash/get'
import { AUTHENTICATION, POST, PROFILE, USER } from '../constants/action_types'

let should404 = false

export function stream(state = {}, action = { type: '' }) {
  if (action.type === AUTHENTICATION.LOGOUT || action.type === PROFILE.DELETE_SUCCESS) {
    return {}
  } else if (!(action.type === POST.DETAIL_SUCCESS || action.type === USER.DETAIL_SUCCESS ||
               action.type === POST.DETAIL_FAILURE || action.type === USER.DETAIL_FAILURE) &&
             !(action.type.indexOf('COMMENT.') === 0 && action.type.indexOf('SUCCESS') > -1) &&
             action && action.meta && action.meta.updateResult === false) {
    return state
  } else if (action.type === POST.DETAIL_SUCCESS ||
             action.type === USER.DETAIL_SUCCESS ||
             action.type === POST.DETAIL_FAILURE ||
             action.type === USER.DETAIL_FAILURE ||
             action.type.indexOf('LOAD_STREAM_') === 0 ||
             action.type.indexOf('LOAD_NEXT_CONTENT_') === 0 ||
             (action.type.indexOf('COMMENT.') === 0 && action.type.indexOf('SUCCESS') > -1) ||
             (action.type.indexOf('POST.') === 0 && action.type.indexOf('SUCCESS') > -1)) {
    switch (action.type) {
      case POST.DETAIL_FAILURE:
      case USER.DETAIL_FAILURE:
        if (get(action, 'error.response.status') === 404) {
          should404 = true
        }
        break
      default:
        break
    }
    return {
      ...state,
      error: action.error,
      meta: action.meta,
      payload: action.payload,
      should404,
      type: action.type,
    }
  }
  return state
}

export default stream

