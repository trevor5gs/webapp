export function logger({ dispatch, getState }) {
  return next => action => {
    console.group(action.type)
    console.info('dispatch', action)
    let result = next(action)
    console.info('next state', getState())
    console.groupEnd(action.type)
    return result
  }
}

