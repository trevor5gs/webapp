import { AUTHENTICATION } from '../constants/action_types'
import {
  loginToken,
  logout as logoutEndpoint,
  forgotPassword,
  refreshAuthToken,
} from '../networking/api'

export function cancelAuthRefresh() {
  return {
    type: AUTHENTICATION.CANCEL_REFRESH,
  }
}

export function clearAuthStore() {
  return {
    type: AUTHENTICATION.CLEAR_STORE,
  }
}

export function signIn(email, password) {
  return {
    type: AUTHENTICATION.SIGN_IN,
    payload: {
      email,
      password,
    },
  }
}

export function getUserCredentials(email, password, meta) {
  return {
    type: AUTHENTICATION.USER,
    payload: {
      endpoint: loginToken(email, password),
      method: 'POST',
      body: {
        email,
        password,
      },
    },
    meta: {
      ...meta,
      pauseRequester: true,
    },
  }
}

export function logout() {
  return {
    type: AUTHENTICATION.LOGOUT,
    payload: {
      endpoint: logoutEndpoint(),
      method: 'DELETE',
    },
  }
}

export function refreshAuthenticationToken(refreshToken) {
  return {
    type: AUTHENTICATION.REFRESH,
    payload: {
      endpoint: refreshAuthToken(refreshToken),
      method: 'POST',
      body: {
        refresh_token: refreshToken,
      },
    },
    meta: {
      pauseRequester: true,
    },
  }
}

export function scheduleAuthRefresh(refreshToken, timeout) {
  return {
    type: AUTHENTICATION.SCHEDULE_REFRESH,
    payload: {
      refreshToken,
      timeout,
    },
  }
}

export function sendForgotPasswordRequest(email) {
  return {
    type: AUTHENTICATION.FORGOT_PASSWORD,
    payload: {
      endpoint: forgotPassword(),
      method: 'POST',
      body: {
        email,
      },
    },
  }
}

