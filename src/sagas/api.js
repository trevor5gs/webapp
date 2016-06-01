import 'isomorphic-fetch'
import { call, select } from 'redux-saga/effects'
import { accessTokenSelector } from './selectors'

export function* fetchCredentials() {
  const accessToken = yield select(accessTokenSelector)
  if (accessToken) {
    return {
      token: {
        access_token: accessToken,
      },
    }
  }

  const tokenPath = (typeof window === 'undefined') ?
        `http://localhost:${process.env.PORT || 6660}/api/webapp-token` :
        `${document.location.protocol}//${document.location.host}/api/webapp-token`

  try {
    const response = yield call(fetch, tokenPath, { credentials: 'same-origin' })
    if (response.ok) {
      // Pass response as binding for response.json
      return yield call([response, response.json])
    }
    return response
  } catch (_err) {
    return yield call(fetchCredentials)
  }
}

function checkStatus(response) {
  if (response.ok) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

export function extractJSON(response) {
  return response ? response.json() : response
}

export function* sagaFetch(path, options) {
  const response = yield call(fetch, path, options)
  checkStatus(response)

  // allow for the json to be empty for a 204
  let json = {}
  if (response.status !== 204) {
    json = yield call(extractJSON, response)
  }
  return { serverResponse: response, json }
}
