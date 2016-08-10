import { PROMOTIONS } from '../constants/action_types'

const initialState = {
  authentication: [],
  loggedIn: [],
  loggedOut: [],
}

export function promotions(state = initialState, action) {
  switch (action.type) {
    case PROMOTIONS.AUTHENTICATION_SUCCESS:
      return {
        ...state,
        authentication: action.payload.response,
      }
    case PROMOTIONS.LOGGED_IN_SUCCESS:
      return {
        ...state,
        loggedIn: action.payload.response,
      }
    case PROMOTIONS.LOGGED_OUT_SUCCESS:
      return {
        ...state,
        loggedOut: action.payload.response,
      }
    default:
      return state
  }
}

export default promotions

