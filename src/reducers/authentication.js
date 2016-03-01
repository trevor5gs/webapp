import { REHYDRATE } from 'redux-persist/constants'
import * as ACTION_TYPES from '../constants/action_types'

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  tokenType: null,
  expiresIn: null,
  createdAt: null,
  refreshToken: null,
  refreshTimeoutId: null,
}

export function authentication(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.AUTHENTICATION.SCHEDULE_REFRESH:
      return { ...state, refreshTimeoutId: action.payload.refreshTimeoutId }
    case ACTION_TYPES.AUTHENTICATION.LOGOUT:
      if (state.refreshTimeoutId) {
        window.clearTimeout(state.refreshTimeoutId)
      }
      return { ...initialState }
    case ACTION_TYPES.PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    case ACTION_TYPES.AUTHENTICATION.USER_SUCCESS:
    case ACTION_TYPES.AUTHENTICATION.REFRESH_SUCCESS:
      return { ...state, ...action.payload.response, isLoggedIn: true }
    case REHYDRATE:
      if (action.key === 'authentication') {
        // Don't take the timeout ID from localstorage
        return {
          ...action.payload,
          refreshTimeoutId: state.refreshTimeoutId,
        }
      }

      return state
    default:
      return state
  }
}
