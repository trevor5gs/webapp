import { LOCATION_CHANGE } from 'react-router-redux'
import { ALERT, AUTHENTICATION, MODAL, PROFILE } from '../constants/action_types'

const initialState = {
  classList: null,
  component: null,
  isActive: false,
  kind: 'Modal',
}

export function modal(state = initialState, action) {
  switch (action.type) {
    case ALERT.OPEN:
    case ALERT.CLOSE:
    case MODAL.OPEN:
    case MODAL.CLOSE:
      return { ...state, ...action.payload }
    case AUTHENTICATION.LOGOUT:
    case PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    case LOCATION_CHANGE:
      if (state.isActive) { return initialState }
      return state
    default:
      return state
  }
}

