import { LOCATION_CHANGE } from 'react-router-redux'
import {
  ALERT,
  AUTHENTICATION,
  MODAL,
  PROFILE,
} from '../constants/action_types'

const initialState = {
  classList: null,
  component: null,
  isActive: false,
  isCompleterActive: false,
  isNotificationsActive: false,
  isProfileMenuActive: false,
  isTextToolsActive: false,
  kind: 'Modal',
  textToolsCoordinates: { top: -200, left: -666 },
  textToolsStates: {},
}

export function modal(state = initialState, action) {
  switch (action.type) {
    case ALERT.OPEN:
    case ALERT.CLOSE:
    case MODAL.OPEN:
    case MODAL.CLOSE:
      return { ...state, ...action.payload }
    case MODAL.TOGGLE_NOTIFICATIONS:
      return { ...state, isNotificationsActive: action.payload.isNotificationsActive }
    case AUTHENTICATION.LOGOUT:
    case PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    case LOCATION_CHANGE:
      if (state.isActive) { return initialState }
      return state
    case MODAL.SET_IS_COMPLETER_ACTIVE:
      return {
        ...state,
        isCompleterActive: action.payload.isCompleterActive,
      }
    case MODAL.SET_IS_PROFILE_MENU_ACTIVE:
      return {
        ...state,
        isProfileMenuActive: action.payload.isProfileMenuActive,
      }
    case MODAL.SET_IS_TEXT_TOOLS_ACTIVE:
      return {
        ...state,
        isTextToolsActive: action.payload.isTextToolsActive,
        textToolsStates: action.payload.textToolsStates,
      }
    case MODAL.SET_TEXT_TOOLS_COORDINATES:
      return {
        ...state,
        textToolsCoordinates: action.payload.textToolsCoordinates,
      }
    default:
      return state
  }
}

