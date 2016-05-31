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
  let auth
  let response
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
      response = action.payload.response
      return {
        ...state,
        ...response,
        expirationDate: new Date((response.createdAt + response.expiresIn) * 1000),
        isLoggedIn: true,
      }
    case REHYDRATE:
      auth = action.payload.authentication
      // Don't take the timeout ID from localstorage
      if (auth) {
        return {
          ...auth,
          refreshTimeoutId: state.refreshTimeoutId,
          expirationDate: new Date((auth.createdAt + auth.expiresIn) * 1000),
        }
      }
      return state
    default:
      return state
  }
}

