import * as TYPE from '../constants/action_types'

export function stream(state = {}, action) {
  return {
    ...state,
    error: action.error,
    meta: action.meta,
    payload: action.payload,
    type: action.type
  }
}

