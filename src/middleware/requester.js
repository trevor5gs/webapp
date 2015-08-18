import * as TYPE from '../../src/constants/action_types'

export function requester() {
  return next => action => {
    const { payload, type, meta } = action

    if (type != TYPE.LOAD_STREAM || !payload) return next(action);

    const { endpoint, vo } = payload

    if (!endpoint) return next(action);

    const SUCCESS = type + '_SUCCESS'
    const REQUEST = type + '_REQUEST'
    const FAILURE = type + '_FAILURE'

    next({ type: REQUEST, payload, meta: meta })

    return fetch(endpoint)
      .then(checkStatus)
      .then(parseJSON)
      .then(response => {
        payload['response'] = response
        next({ meta, payload, type: SUCCESS })
        return true
      })
      .catch(error => {
        next({ error, meta, payload, type: FAILURE })
        return false
      })
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

