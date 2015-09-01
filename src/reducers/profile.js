import { PROFILE } from '../constants/action_types'

// need to hydrate this thing with current user at login
const initialState = {
  payload: {
  },
}

export function profile(state = initialState, action) {
  switch (action.type) {
  case PROFILE.SAVE:
    return {
      ...state,
      error: action.error,
      meta: action.meta,
      payload: action.payload,
      type: action.type,
    }
  default:
    return state
  }
}

