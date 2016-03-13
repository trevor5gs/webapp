import { get } from 'lodash'
import { LOCATION_CHANGE } from 'react-router-redux'
import { routerReducer } from 'react-router-redux'

const previousPath = typeof document === 'undefined' ? '/' : document.location.pathname

// Merge our initial state with routerReducer's initial state
const initialState = {
  ...routerReducer(undefined, { type: null, payload: null }),
  previousPath,
}

export function routeReducer(state = initialState, { type, payload: location }) {
  const newState = routerReducer(state, { type, payload: location })

  if (type !== LOCATION_CHANGE) {
    return newState
  }
  return {
    ...newState,
    location: {
      pathname: get(newState, 'locationBeforeTransitions.pathname'),
    },
    previousPath: get(state, 'locationBeforeTransitions.pathname'),
  }
}

