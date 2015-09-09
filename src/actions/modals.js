import { MODALS, ALERTS } from '../constants/action_types'

export function openModal(component, wrapperClasses = '') {
  return {
    type: MODALS.OPEN,
    meta: {
      kind: 'Modal',
      wrapperClasses: wrapperClasses,
    },
    payload: component,
  }
}

export function closeModal() {
  return {
    type: MODALS.CLOSE,
    payload: null,
  }
}

export function openAlert(component, wrapperClasses = '') {
  return {
    type: ALERTS.OPEN,
    meta: {
      kind: 'Alert',
      wrapperClasses: wrapperClasses,
    },
    payload: component,
  }
}

export function closeAlert() {
  return {
    type: ALERTS.CLOSE,
    payload: null,
  }
}

