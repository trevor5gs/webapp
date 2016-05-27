import { REHYDRATE } from 'redux-persist/constants'
import * as ACTION_TYPES from '../constants/action_types'
import session from '../vendor/session'

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  tokenType: null,
  expirationDate: null,
  expiresIn: null,
  createdAt: null,
  refreshToken: null,
  refreshTimeoutId: null,
}

export function authentication(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case ACTION_TYPES.AUTHENTICATION.SCHEDULE_REFRESH:
      return { ...state, refreshTimeoutId: action.payload.refreshTimeoutId }
    case ACTION_TYPES.AUTHENTICATION.CANCEL_REFRESH:
      return { ...state, refreshTimeoutId: null }
    case ACTION_TYPES.AUTHENTICATION.LOGOUT_SUCCESS:
    case ACTION_TYPES.AUTHENTICATION.LOGOUT_FAILURE:
      session.clear()
      return { ...initialState }
    case ACTION_TYPES.PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    case ACTION_TYPES.AUTHENTICATION.USER_SUCCESS:
    case ACTION_TYPES.AUTHENTICATION.REFRESH_SUCCESS:
    case ACTION_TYPES.PROFILE.SIGNUP_SUCCESS:
      return {
        ...state,
        ...payload.response,
        expirationDate: new Date((payload.response.createdAt + payload.response.expiresIn) * 1000),
        isLoggedIn: true,
      }
    case REHYDRATE:
      // Don't take the timeout ID from localstorage
      if (payload.authentication) {
        return {
          ...payload.authentication,
          refreshTimeoutId: state.refreshTimeoutId,
        }
      }
      return state
    default:
      return state
  }
}

