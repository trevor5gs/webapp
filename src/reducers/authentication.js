import * as ACTION_TYPES from '../constants/action_types'

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  tokenType: null,
  expiresIn: null,
  createdAt: null,
}

export function authentication(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.AUTHENTICATION.CLIENT_SUCCESS:
      const { response } = action.payload
      return { ...state, ...response }
    default:
      return state
  }
}

