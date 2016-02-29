import { AUTHENTICATION, OMNIBAR, PROFILE } from '../constants/action_types'

const initialState = {
  classList: null,
  isActive: false,
}

export function omnibar(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATION.LOGOUT:
    case PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    case OMNIBAR.OPEN:
    case OMNIBAR.CLOSE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

