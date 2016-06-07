import * as ACTION_TYPES from '../constants/action_types'
import {
  loginToken,
  logout as logoutEndpoint,
  forgotPassword,
  refreshAuthToken,
} from '../networking/api'

export function cancelAuthRefresh() {
  return {
    type: ACTION_TYPES.AUTHENTICATION.CANCEL_REFRESH,
  }
}

export function clearAuthStore() {
  return {
    type: ACTION_TYPES.AUTHENTICATION.CLEAR_STORE,
  }
}

export function signIn(email, password) {
  return {
    type: ACTION_TYPES.AUTHENTICATION.SIGN_IN,
    payload: {
      email,
      password,
    },
  }
}

export function getUserCredentials(email, password, meta) {
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
    meta: {
      ...meta,
      pauseRequester: true,
    },
  }
}

export function logout() {
  return {
    type: ACTION_TYPES.AUTHENTICATION.LOGOUT,
    payload: {
      endpoint: logoutEndpoint(),
      method: 'DELETE',
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
    meta: {
      pauseRequester: true,
    },
  }
}

export function scheduleAuthRefresh(refreshToken, timeout) {
  return {
    type: ACTION_TYPES.AUTHENTICATION.SCHEDULE_REFRESH,
    payload: {
      refreshToken,
      timeout,
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

