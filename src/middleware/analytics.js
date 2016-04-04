import { LOCATION_CHANGE } from 'react-router-redux'
import * as ACTION_TYPES from '../constants/action_types'

export function analytics() {
  return next => action => {
    const { payload, type } = action

    if ((type !== ACTION_TYPES.TRACK.EVENT &&
         type !== LOCATION_CHANGE &&
         type !== ACTION_TYPES.LOAD_NEXT_CONTENT_REQUEST) ||
        !payload || !window) {
      return next(action)
    }

    // Track Event
    if (type === ACTION_TYPES.TRACK.EVENT) {
      const { label, options } = payload
      if (window.analytics) {
        window.analytics.track(label, options)
      }
      if (window.ga) {
        window.ga('send', 'event', 'Ello', label)
      }
      return next({ payload: { label, options }, type: action.type })
    }

    // Track Page Views
    if (type === LOCATION_CHANGE || type === ACTION_TYPES.LOAD_NEXT_CONTENT_REQUEST) {
      if (window.analytics) {
        window.analytics.page()
      }
      if (window.ga) {
        window.ga('send', 'pageview')
      }
      return next(action)
    }

    return next(action)
  }
}

