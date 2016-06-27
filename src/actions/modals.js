import { GUI, MODAL, ALERT } from '../constants/action_types'

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

export function setIsDiscoverMenuActive({ isActive }) {
  return {
    type: GUI.SET_IS_DISCOVER_MENU_ACTIVE,
    payload: {
      isDiscoverMenuActive: isActive,
    },
  }
}

