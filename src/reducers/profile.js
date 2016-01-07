import { PROFILE } from '../constants/action_types'

// need to hydrate this thing with current user at login
const initialState = {
  payload: {
  },
}

export function profile(state = initialState, action) {
  switch (action.type) {
    case PROFILE.AVAILABILITY_SUCCESS:
      return { ...state, ...action.payload.response }
    case PROFILE.LOAD_REQUEST:
    case PROFILE.LOAD_SUCCESS:
    case PROFILE.SAVE_REQUEST:
    case PROFILE.SAVE_SUCCESS:
      const response = action.payload.response ? action.payload.response : {}
      return {
        availability: state.availability,
        type: action.type,
        meta: action.meta,
        error: action.error,
        payload: {
          ...state.payload,
          ...response,
        },
      }

    case PROFILE.TMP_AVATAR_CREATED:
    case PROFILE.TMP_COVER_CREATED:
      return {
        availability: state.availability,
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

