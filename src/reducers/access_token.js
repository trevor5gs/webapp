import * as ACTION_TYPES from '../constants/action_types'

export function accessToken(state = { token: null }, action) {
  const newState = { ...state }
  switch (action.type) {
    case ACTION_TYPES.ACCESS_TOKEN.SAVE:
      newState.token = action.payload
      return newState
    case ACTION_TYPES.ACCESS_TOKEN.DELETE:
      newState.token = null
      return newState
    default:
      return state
  }
}

