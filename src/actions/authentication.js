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

export function clearAuthToken() {
  return {
    type: AUTHENTICATION.CLEAR_AUTH_TOKEN,
  }
}

export function signIn(email, password) {
  return {
    type: AUTHENTICATION.SIGN_IN,
    payload: {
      method: 'POST',
      email,
      password,
    },
  }
}

export function getUserCredentials(email, password, meta) {
  return {
    type: AUTHENTICATION.USER,
    payload: {
      endpoint: loginToken(),
      method: 'POST',
      body: {
        email,
        password,
      },
    },
    meta,
  }
}

export function logout() {
  return {
    type: AUTHENTICATION.LOGOUT,
    payload: {
      endpoint: logoutEndpoint(),
      method: 'DELETE',
    },
    meta: {
      successAction: () => {
        localStorage.clear()
        requestAnimationFrame(() => {
          window.location.href = '/enter'
        })
      },
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
      failureAction: () => {
        localStorage.clear()
        requestAnimationFrame(() => {
          window.location.href = '/enter'
        })
      },
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

