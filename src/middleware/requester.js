/* eslint-disable max-len */
import { camelizeKeys } from 'humps'
import * as ACTION_TYPES from '../constants/action_types'
import { resetAuth } from '../networking/auth'
import { get } from 'lodash'

const runningFetches = {}

let requesterIsPaused = false
let requestQueue = []

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

function getHeadHeader(accessToken, lastCheck) {
  return {
    ...getAuthToken(accessToken),
    'If-Modified-Since': lastCheck,
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

const forwardableActions = [
  ACTION_TYPES.AUTHENTICATION.LOGOUT,
]

const shouldForwardAction = ({ type }) =>
      forwardableActions.indexOf(type) !== -1

const processQueue = (queue, handler) => {
  if (queue.length === 0) return queue

  const [action, ...tail] = queue
  handler(action)
  return processQueue(tail, handler)
}

export const requester = store => next => action => {
  const { payload, type, meta } = action
  if (type === ACTION_TYPES.REQUESTER.PAUSE) {
    requesterIsPaused = true
    return next(action)
  }

  if (type === ACTION_TYPES.REQUESTER.UNPAUSE) {
    requesterIsPaused = false
    requestQueue = processQueue(requestQueue, queuedAction => {
      store.dispatch(queuedAction)
    })
    return next(action)
  }

  // This is problematic... :(
  if ((type !== ACTION_TYPES.LOAD_STREAM &&
        type !== ACTION_TYPES.LOAD_NEXT_CONTENT &&
        type !== ACTION_TYPES.AUTHENTICATION.FORGOT_PASSWORD &&
        type !== ACTION_TYPES.AUTHENTICATION.USER &&
        type !== ACTION_TYPES.AUTHENTICATION.LOGOUT &&
        type !== ACTION_TYPES.AUTHENTICATION.REFRESH &&
        type !== ACTION_TYPES.COMMENT.CREATE &&
        type !== ACTION_TYPES.COMMENT.DELETE &&
        type !== ACTION_TYPES.COMMENT.EDITABLE &&
        type !== ACTION_TYPES.COMMENT.UPDATE &&
        type !== ACTION_TYPES.COMMENT.FLAG &&
        type !== ACTION_TYPES.EMOJI.LOAD &&
        type !== ACTION_TYPES.HEAD &&
        type !== ACTION_TYPES.INVITATIONS.INVITE &&
        type !== ACTION_TYPES.POST.AUTO_COMPLETE &&
        type !== ACTION_TYPES.POST.COMMENT &&
        type !== ACTION_TYPES.POST.CREATE &&
        type !== ACTION_TYPES.POST.DELETE &&
        type !== ACTION_TYPES.POST.EDITABLE &&
        type !== ACTION_TYPES.POST.FLAG &&
        type !== ACTION_TYPES.POST.LOVE &&
        type !== ACTION_TYPES.POST.POST_PREVIEW &&
        type !== ACTION_TYPES.POST.UPDATE &&
        type !== ACTION_TYPES.POST_FORM &&
        type !== ACTION_TYPES.POST_JSON &&
        type !== ACTION_TYPES.PROFILE.AVAILABILITY &&
        type !== ACTION_TYPES.PROFILE.DELETE &&
        type !== ACTION_TYPES.PROFILE.EXPORT &&
        type !== ACTION_TYPES.PROFILE.LOAD &&
        type !== ACTION_TYPES.PROFILE.REQUEST_INVITE &&
        type !== ACTION_TYPES.PROFILE.SAVE &&
        type !== ACTION_TYPES.RELATIONSHIPS.UPDATE
      ) || !payload) {
    return next(action)
  }

  if (requesterIsPaused) {
    requestQueue = [...requestQueue, action]
    return next(action)
  }

  if (shouldForwardAction(action)) {
    next(action)
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
  payload.pathname = get(state, 'routing.location.pathname', '')

  // dispatch the start of the request
  store.dispatch({ type: REQUEST, payload, meta })

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
      .then((response) =>
        response.ok ? response.json() : response
      )
      .catch(() =>
        fetchCredentials()
      )
  }

  function fireSuccessAction() {
    if (meta && meta.successAction) {
      store.dispatch(meta.successAction)
    }
  }

  function fireFailureAction() {
    if (meta && meta.failureAction) {
      store.dispatch(meta.failureAction)
    }
  }

  const options = { method: method || 'GET', credentials: 'include' }
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
        switch (method) {
          case 'HEAD':
            // TODO: will need to update where to grab the lastCheck
            // date if we end up hooking up following/starred checks
            options.headers = getHeadHeader(accessToken, state.gui.lastNotificationCheck)
            break
          case 'POST':
            options.headers = getPostJsonHeader(accessToken)
            break
          default:
            options.headers = getGetHeader(accessToken)
            break
        }
        return fetch(endpoint.path, options)
            .then(checkStatus)
            .then(response => {
              delete runningFetches[response.url]
              payload.serverResponse = response
              if (response.status === 200 || response.status === 201) {
                return response.json().then((json) => {
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
                  store.dispatch({ meta, payload, type: SUCCESS })
                  fireSuccessAction()
                  return true
                })
              } else if (response.ok) {
                // TODO: handle a 204 properly so that we know to stop paging
                store.dispatch({ meta, payload, type: SUCCESS })
                fireSuccessAction()
              } else {
                // TODO: is this what should be happening here?
                store.dispatch({ meta, payload, type: SUCCESS })
                fireSuccessAction()
              }
              return Promise.resolve(true);
            })
            .catch(error => {
              if (error.response) {
                delete runningFetches[error.response.url]
              }
              if ((error.response.status === 401 || error.response.status === 403) &&
                  get(state, 'routing.location.pathname', '').indexOf('/onboarding') === 0 &&
                  typeof document !== 'undefined') {
                resetAuth(store.dispatch, document.location)
              }
              store.dispatch({ error, meta, payload, type: FAILURE })
              fireFailureAction()
              return false
            })
      })
  )
}

export { runningFetches }
