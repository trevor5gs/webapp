import { TRACK } from '../../src/constants/action_types'

export function analytics() {
  return next => action => {
    const { payload, type } = action

    if ((type !== TRACK.EVENT && type !== TRACK.PAGE_VIEW) || !payload || !window) {
      return next(action)
    }

    // Track Event
    if (type === TRACK.EVENT) {
      const { label, options } = payload
      if (window.analytics) {
        window.analytics.track(label, options)
      }
      if (window.ga) {
        window.ga('send', 'event', 'Ello', label)
      }
      return next({ payload: { label, options  }, type: action.type })
    }

    // Track Page Views
    if (type === TRACK.PAGE_VIEW) {
      if (window.analytics) {
        window.analytics.page()
      }
      if (window.ga) {
        window.ga('send', 'pageview')
      }
      return next({ payload: {}, type: action.type })
    }

    return next(action)
  }
}
