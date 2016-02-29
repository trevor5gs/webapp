import { LOCATION_CHANGE } from 'react-router-redux'

const initialState = {
  location: { pathname: '/' },
}

export function routeReducer(state = initialState, { type, payload: location }) {
  if (type !== LOCATION_CHANGE) {
    return state
  }
  return {
    ...state,
    previousPath: state.location.pathname,
    location,
  }
}
