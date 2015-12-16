import * as ACTION_TYPES from '../constants/action_types'

function extractToken(hash, oldToken) {
  const match = hash.match(/access_token=([^&]+)/)
  let token = !!match && match[1]
  if (!token) {
    token = oldToken
  }
  return token
}

export function checkAuth(dispatch, oldToken, location) {
  const token = extractToken(location.hash, oldToken)
  if (window.history && window.history.replaceState) {
    window.history.replaceState(window.history.state, document.title, window.location.pathname)
  } else {
    document.location.hash = '' // this is a fallback for IE < 10
  }
  if (token) {
    dispatch({
      type: ACTION_TYPES.AUTHENTICATION.USER_SUCCESS,
      payload: {
        response: {
          accessToken: token,
          tokenType: 'onboarding_auth',
          expiresIn: 7200,
          createdAt: new Date(),
        },
      },
    })
  } else {
    const url = ENV.AUTH_DOMAIN + '/api/oauth/authorize.html' +
      '?response_type=token' +
      '&scope=web_app+public' +
      '&client_id=' + ENV.AUTH_CLIENT_ID +
      '&redirect_uri=' + ENV.AUTH_REDIRECT_URI

    window.location.href = url
  }
}

export function resetAuth(dispatch, oldToken, location) {
  if (oldToken) {
    dispatch({
      type: ACTION_TYPES.AUTHENTICATION.LOGOUT,
    })
  }
  checkAuth(dispatch, null, location)
}

