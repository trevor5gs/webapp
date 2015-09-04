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
      type: action.type,
      meta: action.meta,
      error: action.error,
      payload: {
        ...state.payload,
        ...action.payload,
      },
    }
  case PROFILE.AVATAR_WAS_SAVED:
  case PROFILE.COVER_WAS_SAVED:
    return {
      type: action.type,
      meta: action.meta,
      error: action.error,
      payload: {
        ...state.payload,
        ...action.payload,
      },
    }
  default:
    return state
  }
}

