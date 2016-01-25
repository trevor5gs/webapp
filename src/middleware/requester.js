/* eslint-disable max-len */
import { camelizeKeys } from 'humps'
import * as ACTION_TYPES from '../constants/action_types'
import { resetAuth } from '../networking/auth'

const runningFetches = {}
const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

function getAuthToken(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
  }
}

function getPostJsonHeader(accessToken) {
  return {
    ...defaultHeaders,
    ...getAuthToken(accessToken),
  }
}

function getGetHeader(accessToken) {
  return getAuthToken(accessToken)
}

function checkStatus(response) {
  if (response.ok) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

function parseLink(linksHeader) {
  if (!linksHeader) { return {} }
  const result = {}
  const entries = linksHeader.split(',')
  // compile regular expressions ahead of time for efficiency
  const relsRegExp = /\brel="?([^"]+)"?\s*;?/
  const keysRegExp = /(\b[0-9a-z\.-]+\b)/g
  const sourceRegExp = /^<(.*)>/
  for (let entry of entries) {
    entry = entry.trim()
    const rels = relsRegExp.exec(entry)
    if (rels) {
      const keys = rels[1].match(keysRegExp)
      const source = sourceRegExp.exec(entry)[1]
      for (const key of keys) {
        result[key] = source
      }
    }
  }
  return result
}

export const requester = store => next => action => {
  const { payload, type, meta } = action

  // This is problematic... :(
  if ((type !== ACTION_TYPES.LOAD_STREAM &&
        type !== ACTION_TYPES.LOAD_NEXT_CONTENT &&
        type !== ACTION_TYPES.LOAD_PREV_CONTENT &&
        type !== ACTION_TYPES.AUTHENTICATION.FORGOT_PASSWORD &&
        type !== ACTION_TYPES.AUTHENTICATION.USER &&
        type !== ACTION_TYPES.COMMENT.DELETE &&
        type !== ACTION_TYPES.COMMENT.EDIT &&
        type !== ACTION_TYPES.COMMENT.FLAG &&
        type !== ACTION_TYPES.POST.COMMENT &&
        type !== ACTION_TYPES.POST.DELETE &&
        type !== ACTION_TYPES.POST.EDIT &&
        type !== ACTION_TYPES.POST.FLAG &&
        type !== ACTION_TYPES.POST.LOVE &&
        type !== ACTION_TYPES.POST.REPOST &&
        type !== ACTION_TYPES.POST_FORM &&
        type !== ACTION_TYPES.POST_JSON &&
        type !== ACTION_TYPES.PROFILE.LOAD &&
        type !== ACTION_TYPES.PROFILE.SAVE &&
        type !== ACTION_TYPES.PROFILE.AVAILABILITY &&
        type !== ACTION_TYPES.PROFILE.REQUEST_INVITE &&
        type !== ACTION_TYPES.RELATIONSHIPS.UPDATE
      ) || !payload) {
    return next(action)
  }

  // TODO: I think the body should actually come
  // from the endpoint instead of the payload
  const { endpoint, method, body } = payload

  if (!endpoint) return next(action);

  if (runningFetches[endpoint.path]) { return next(action) }
  runningFetches[endpoint.path] = true

  const REQUEST = `${type}_REQUEST`
  const SUCCESS = `${type}_SUCCESS`
  const FAILURE = `${type}_FAILURE`

  const state = store.getState()
  // this allows us to set the proper result in the json reducer
  payload.pathname = state.routing.location.pathname

  // dispatch the start of the request
  next({ type: REQUEST, payload, meta })

  function fetchCredentials() {
    if (state.authentication && state.authentication.accessToken) {
      return new Promise((resolve) => {
        resolve({ token: { access_token: state.authentication.accessToken } })
      })
    }
    const tokenPath = (typeof window === 'undefined') ?
      `http://localhost:${ENV.PORT}/api/webapp-token` :
      `${document.location.protocol}//${document.location.host}/api/webapp-token`
    return fetch(tokenPath)
      .then((response) => {
        return response.ok ? response.json() : response
      })
      .catch(() => {
        return fetchCredentials()
      })
  }

  const options = { method: method || 'GET' }
  if (options.method !== 'GET' && options.method !== 'HEAD') {
    options.body = body || null
    if (options.body && typeof options.body !== 'string') {
      options.body = JSON.stringify(options.body)
    }
  }

  return (
    fetchCredentials()
      .then((tokenJSON) => {
        const accessToken = tokenJSON.token.access_token
        options.headers = !method || method === 'GET' ?
          getGetHeader(accessToken) :
          getPostJsonHeader(accessToken)
        fetch(endpoint.path, options)
            .then(checkStatus)
            .then(response => {
              delete runningFetches[response.url]
              if (response.status === 200) {
                response.json().then((json) => {
                  payload.response = camelizeKeys(json)
                  if (endpoint.pagingPath && payload.response[meta.mappingType].id) {
                    payload.pagination = payload.response[meta.mappingType].links[endpoint.pagingPath].pagination
                  } else {
                    const linkPagination = parseLink(response.headers.get('Link'))
                    linkPagination.totalCount = parseInt(response.headers.get('X-Total-Count'), 10)
                    linkPagination.totalPages = parseInt(response.headers.get('X-Total-Pages'), 10)
                    linkPagination.totalPagesRemaining = parseInt(response.headers.get('X-Total-Pages-Remaining'), 10)
                    payload.pagination = linkPagination
                  }
                  next({ meta, payload, type: SUCCESS })
                  return true
                })
              } else if (response.ok) {
                // TODO: handle a 204 properly so that we know to stop paging
                next({ ...action, type: SUCCESS })
                return true
              } else {
                // TODO: is this what should be happening here?
                next({ ...action, type: SUCCESS })
                return true
              }
            })
            .catch(error => {
              delete runningFetches[error.response.url]
              if ((error.response.status === 401 || error.response.status === 403) &&
                  state.routing.location.pathname.indexOf('/onboarding') === 0 &&
                  typeof document !== 'undefined') {
                resetAuth(store.dispatch, document.location)
              }
              next({ error, meta, payload, type: FAILURE })
              return false
            })
      })
  )
}

export { runningFetches }

