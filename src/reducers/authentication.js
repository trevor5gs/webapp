import * as ACTION_TYPES from '../constants/action_types'

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  tokenType: null,
  expiresIn: null,
  createdAt: null,
}

export function authentication(state = initialState, action) {
  const { response } = action.payload
  switch (action.type) {
    case ACTION_TYPES.AUTHENTICATION.CLIENT_SUCCESS:
      return { ...state, ...response, isLoggedIn: false }
    case ACTION_TYPES.AUTHENTICATION.LOGOUT:
      return { ...initialState }
    case ACTION_TYPES.AUTHENTICATION.USER_SUCCESS:
      return { ...state, ...response, isLoggedIn: false }
    default:
      return state
  }
}

