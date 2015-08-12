export default function promiseMiddleware() {
  return next => action => {
    const { promise, type, ...rest } = action;

    if (!promise) return next(action);

    const SUCCESS = type + '_SUCCESS'
    const REQUEST = type + '_REQUEST'
    const FAILURE = type + '_FAILURE'

    next({ ...rest, type: REQUEST })

    return promise()
      .then(checkStatus)
      .then(parseJSON)
      .then(response => {
        next({ ...rest, response, type: SUCCESS })
        return true
      })
      .catch(error => {
        next({ ...rest, error, type: FAILURE })
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

