import { TRACK } from '../constants/action_types'

export function trackPageView() {
  return {
    type: TRACK.PAGE_VIEW,
    meta: {},
    payload: {},
  }
}

export function trackEvent(label, options = {}) {
  return {
    type: TRACK.EVENT,
    meta: {},
    payload: {
      label: label,
      options: options,
    },
  }
}

