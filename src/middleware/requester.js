export function requester() {
  return next => action => {
    const { payload, type } = action
    const { endpoint, vo } = payload

    if (!endpoint) return next(action);

    const SUCCESS = type + '_SUCCESS'
    const REQUEST = type + '_REQUEST'
    const FAILURE = type + '_FAILURE'

    next({ type: REQUEST, payload })

    return fetch(endpoint)
      .then(checkStatus)
      .then(parseJSON)
      .then(response => {
        next({ payload: { response }, type: SUCCESS })
        return true
      })
      .catch(error => {
        next({ error, type: FAILURE })
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

