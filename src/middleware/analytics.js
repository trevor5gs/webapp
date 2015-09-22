import { TRACK, PROFILE } from '../../src/constants/action_types'

export function analytics() {
  return next => action => {
    const { payload, type } = action

    if (type === PROFILE.LOAD_SUCCESS && window) {
      const { gaUniqueId, createdAt, allowsAnalytics } = action.payload.response.users

      // Setup Segment tracking
      if (window.analytics && allowsAnalytics) {
        window.analytics.load(ENV.SEGMENT_WRITE_KEY)
        window.analytics.identify(gaUniqueId, {
          createdAt: createdAt,
          createdAtGa: createdAt,
          uiVersion: ENV.SEGMENT_UI_VERSION,
        })
        window.analytics.page()
      }
      // Setup GA tracking
      if (window.ga && allowsAnalytics) {
        window.ga('create', ENV.GA_ACCOUNT_ID, { 'userId': gaUniqueId })
        window.ga('set', 'dimension1', createdAt)
        window.ga('set', 'anonymizeIp', true)
        window.ga('set', 'dimension2', ENV.SEGMENT_UI_VERSION)
        window.ga('send', 'pageview')
      }
    }

    if ((type !== TRACK.EVENT && type !== TRACK.PAGE_VIEW) || !payload || !window) {
      return next(action)
    }

    // Track Event
    if (type === TRACK.EVENT) {
      const { label, options } = payload
      if (window.analytics) {
        window.analytics.track(event, options)
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
