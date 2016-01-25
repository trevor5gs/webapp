import { UPDATE_LOCATION } from 'react-router-redux'

const initialState = {
  location: { pathname: '/' },
}

export function routeReducer(state = initialState, { type, payload: location }) {
  if (type !== UPDATE_LOCATION) {
    return state
  }
  return {
    ...state,
    previousPath: state.location.pathname,
    location,
  }
}
