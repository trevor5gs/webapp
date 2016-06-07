import { MODAL, ALERT } from '../constants/action_types'

export function openModal(component, classList = '') {
  return {
    type: MODAL.OPEN,
    payload: {
      classList,
      component,
      isActive: true,
      kind: 'Modal',
    },
  }
}

export function closeModal() {
  return {
    type: MODAL.CLOSE,
    payload: {
      classList: null,
      component: null,
      isActive: false,
      kind: 'Modal',
    },
  }
}

export function openAlert(component, classList = '') {
  return {
    type: ALERT.OPEN,
    payload: {
      classList,
      component,
      isActive: true,
      kind: 'Alert',
    },
  }
}

export function closeAlert() {
  return {
    type: ALERT.CLOSE,
    payload: {
      classList: null,
      component: null,
      isActive: false,
      kind: 'Alert',
    },
  }
}

// TODO: Move to actions/editor
export function setIsTextToolsActive({ isActive, textToolsStates = {} }) {
  return {
    type: MODAL.SET_IS_TEXT_TOOLS_ACTIVE,
    payload: {
      isTextToolsActive: isActive,
      textToolsStates,
    },
  }
}

// TODO: Move to actions/editor
export function setTextToolsCoordinates({ textToolsCoordinates = { top: -200, left: -666 } }) {
  return {
    type: MODAL.SET_TEXT_TOOLS_COORDINATES,
    payload: {
      textToolsCoordinates,
    },
  }
}

