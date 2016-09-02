import { TRACK } from '../constants/action_types'

export function trackEvent(label, options = {}) {
  return {
    type: TRACK.EVENT,
    meta: {},
    payload: {
      label,
      options,
    },
  }
}

export default trackEvent

