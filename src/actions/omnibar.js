import { OMNIBAR } from '../constants/action_types'

export function openOmnibar(component, classList = '') {
  return {
    type: OMNIBAR.OPEN,
    payload: {
      classList,
      component,
      isActive: true,
    },
  }
}

export function closeOmnibar() {
  return {
    type: OMNIBAR.CLOSE,
    payload: {
      classList: null,
      component: null,
      isActive: false,
    },
  }
}

