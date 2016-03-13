import * as ACTION_TYPES from '../constants/action_types'
import {
  loginToken,
  logout as logoutEndpoint,
  forgotPassword,
  refreshAuthToken,
} from '../networking/api'

export function cancelAuthRefresh() {
  return (dispatch, getState) => {
    const refreshTimeoutId = getState().authentication.refreshTimeoutId
    if (!!refreshTimeoutId) {
      clearTimeout(refreshTimeoutId)
    }

    return dispatch({
      type: ACTION_TYPES.AUTHENTICATION.CANCEL_REFRESH,
    })
  }
}

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

export function logout() {
  return dispatch => {
    dispatch(cancelAuthRefresh())

    return dispatch({
      type: ACTION_TYPES.AUTHENTICATION.LOGOUT,
      payload: {
        endpoint: logoutEndpoint(),
        method: 'DELETE',
      },
    })
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

export function scheduleAuthRefresh(refreshToken, timeout) {
  return dispatch => {
    const refreshTimeoutId = window.setTimeout(() => {
      dispatch(refreshAuthenticationToken(refreshToken))
    }, timeout)

    return dispatch({
      type: ACTION_TYPES.AUTHENTICATION.SCHEDULE_REFRESH,
      payload: {
        refreshTimeoutId,
      },
    })
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

