import { get } from 'lodash'
import { LOCATION_CHANGE } from 'react-router-redux'
import { routerReducer } from 'react-router-redux'

// Merge our initial state with routerReducer's initial state
const initialState = {
  ...routerReducer(undefined, { type: null, payload: null }),
  previousPath: document.location.pathname,
}

export function routeReducer(state = initialState, { type, payload: location }) {
  const newState = routerReducer(state, { type, payload: location })

  if (type !== LOCATION_CHANGE) {
    return newState
  }
  return {
    ...newState,
    previousPath: get(state, 'locationBeforeTransitions.pathname'),
  }
}
