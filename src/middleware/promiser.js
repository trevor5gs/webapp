export default function promiseMiddleware() {
  return next => action => {
    const { promise, type, ...rest } = action;

    if (!promise) return next(action);

    const SUCCESS = type + '_SUCCESS';
    const REQUEST = type + '_REQUEST';
    const FAILURE = type + '_FAILURE';

    next({ ...rest, type: REQUEST });

    // TODO: JSON conversion should be moved to the reducer level
    return promise()
      .then(response => response.json())
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

