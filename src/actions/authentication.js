import * as ACTION_TYPES from '../constants/action_types'
import { loginToken, forgotPassword } from '../networking/api'

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

