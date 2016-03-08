import {
  ALERT,
  AUTHENTICATION,
  MODAL,
  PROFILE,
  GUI,
} from '../constants/action_types'

const initialState = {
  classList: null,
  component: null,
  isActive: false,
  activeNotificationsTabType: 'all',
  isNotificationsActive: false,
  kind: 'Modal',
}

export function modal(state = initialState, action) {
  switch (action.type) {
    case ALERT.OPEN:
    case ALERT.CLOSE:
    case MODAL.OPEN:
    case MODAL.CLOSE:
      return { ...state, ...action.payload }
    case GUI.TOGGLE_NOTIFICATIONS:
      return { ...state, isNotificationsActive: action.payload.isNotificationsActive }
    case GUI.NOTIFICATIONS_TAB:
      return { ...state, activeNotificationsTabType: action.payload.activeTabType }
    case AUTHENTICATION.LOGOUT:
    case PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    default:
      return state
  }
}

