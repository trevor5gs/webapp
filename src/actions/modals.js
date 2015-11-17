import { MODAL, ALERT } from '../constants/action_types'

export function openModal(component, wrapperClasses = '') {
  return {
    type: MODAL.OPEN,
    meta: {
      kind: 'Modal',
      wrapperClasses: wrapperClasses,
    },
    payload: component,
  }
}

export function closeModal() {
  return {
    type: MODAL.CLOSE,
    payload: null,
  }
}

export function openAlert(component, wrapperClasses = '') {
  return {
    type: ALERT.OPEN,
    meta: {
      kind: 'Alert',
      wrapperClasses: wrapperClasses,
    },
    payload: component,
  }
}

export function closeAlert() {
  return {
    type: ALERT.CLOSE,
    payload: null,
  }
}

