import * as ACTION_TYPES from '../../src/constants/action_types'
import { camelizeKeys } from 'humps'
import 'isomorphic-fetch'

let linkPagination = {}

function getAuthToken() {
  return {
    'Authorization': `Bearer ${localStorage.getItem('ello_access_token')}`,
  }
}

function getPostJsonHeader() {
  return {
    ...getAuthToken(),
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
}

function getGetHeader() {
  return getAuthToken()
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

function parseJSON(response) {
  linkPagination = parseLink(response.headers.get('Link'))
  linkPagination.totalCount = parseInt(response.headers.get('X-Total-Count'), 10)
  linkPagination.totalPages = parseInt(response.headers.get('X-Total-Pages'), 10)
  linkPagination.totalPagesRemaining = parseInt(response.headers.get('X-Total-Pages-Remaining'), 10)
  return (response.status === 200) ? response.json() : response
}

export function requester() {
  return next => action => {
    const { payload, type, meta } = action

    // This is problematic... :(
    if ((type !== ACTION_TYPES.LOAD_STREAM &&
         type !== ACTION_TYPES.LOAD_NEXT_CONTENT &&
         type !== ACTION_TYPES.LOAD_PREV_CONTENT &&
         type !== ACTION_TYPES.POST.COMMENT &&
         type !== ACTION_TYPES.POST.DELETE &&
         type !== ACTION_TYPES.POST.EDIT &&
         type !== ACTION_TYPES.POST.LOVE &&
         type !== ACTION_TYPES.POST.REPOST &&
         type !== ACTION_TYPES.POST_FORM &&
         type !== ACTION_TYPES.POST_JSON &&
         type !== ACTION_TYPES.PROFILE.LOAD &&
         type !== ACTION_TYPES.PROFILE.SAVE
        ) || !payload) {
      return next(action)
    }

    const { endpoint, method, body } = payload

    if (!endpoint) return next(action);

    const REQUEST = type + '_REQUEST'
    const SUCCESS = type + '_SUCCESS'
    const FAILURE = type + '_FAILURE'

    // dispatch the start of the request
    next({ type: REQUEST, payload, meta: meta })

    const options = {
      method: method || 'GET',
      headers: (!method || method === 'GET') ? getGetHeader() : getPostJsonHeader(),
    }

    if (options.method !== 'GET' && options.method !== 'HEAD') {
      options.body = body || null
    }

    return fetch(endpoint.path, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(response => {
        payload.response = camelizeKeys(response)
        if (endpoint.pagingPath && payload.response[meta.mappingType].id) {
          payload.pagination = payload.response[meta.mappingType].links[endpoint.pagingPath].pagination
        } else {
          payload.pagination = linkPagination
        }
        next({ meta, payload, type: SUCCESS })
        return true
      })
      .catch(error => {
        if (error.response.status === 401 && typeof window.resetAuth === 'function') {
          window.resetAuth()
        }
        next({ error, meta, payload, type: FAILURE })
        return false
      })
  }
}

