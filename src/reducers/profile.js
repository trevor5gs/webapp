import { PROFILE } from '../constants/action_types'

// need to hydrate this thing with current user at login
const initialState = {
  payload: {
  },
}

export function profile(state = initialState, action) {
  switch (action.type) {
  case PROFILE.LOAD_REQUEST:
  case PROFILE.LOAD_SUCCESS:
  case PROFILE.SAVE_REQUEST:
  case PROFILE.SAVE_SUCCESS:
    const response = action.payload.response ? action.payload.response : {}
    return {
      type: action.type,
      meta: action.meta,
      error: action.error,
      payload: {
        ...state.payload,
        ...response.linked,
        ...response.users,
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

