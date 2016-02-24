import * as ACTION_TYPES from '../constants/action_types'
import { loginToken, forgotPassword, refreshAuthToken } from '../networking/api'

export function getUserCredentials(email, password) {
  return {
    type: ACTION_TYPES.AUTHENTICATION.USER,
    payload: {
      endpoint: loginToken(email, password),
      method: 'POST',
      body: {
        email,
        password,
      },
    },
  }
}

export function refreshAuthenticationToken(refreshToken) {
  return {
    type: ACTION_TYPES.AUTHENTICATION.REFRESH,
    payload: {
      endpoint: refreshAuthToken(refreshToken),
      method: 'POST',
      body: {
        refresh_token: refreshToken,
      },
    },
  }
}

export function sendForgotPasswordRequest(email) {
  return {
    type: ACTION_TYPES.AUTHENTICATION.FORGOT_PASSWORD,
    payload: {
      endpoint: forgotPassword(),
      method: 'POST',
      body: {
        email,
      },
    },
  }
}
