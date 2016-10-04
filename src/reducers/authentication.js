import { REHYDRATE } from 'redux-persist/constants'
import { AUTHENTICATION, PROFILE } from '../constants/action_types'
import Session from '../lib/session'

export const initialState = {
  accessToken: null,
  createdAt: null,
  expirationDate: null,
  expiresIn: null,
  isLoggedIn: false,
  refreshTimeoutId: null,
  refreshToken: null,
  tokenType: null,
}

export function authentication(state = initialState, action) {
  let auth
  let response
  switch (action.type) {
    case AUTHENTICATION.SCHEDULE_REFRESH:
      return { ...state, refreshTimeoutId: action.payload.refreshTimeoutId }
    case AUTHENTICATION.CANCEL_REFRESH:
      return { ...state, refreshTimeoutId: null }
    case AUTHENTICATION.CLEAR_STORE:
      return initialState
    case AUTHENTICATION.LOGOUT_SUCCESS:
    case AUTHENTICATION.LOGOUT_FAILURE:
      Session.clear()
      return { ...initialState }
    case PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    case AUTHENTICATION.USER_SUCCESS:
    case AUTHENTICATION.REFRESH_SUCCESS:
    case PROFILE.SIGNUP_SUCCESS:
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

