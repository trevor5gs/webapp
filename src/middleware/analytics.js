import _ from 'lodash'
import { LOCATION_CHANGE } from 'react-router-redux'
import * as ACTION_TYPES from '../constants/action_types'

export const analytics = store => next => action => {
  const { payload, type } = action

  if ((type !== LOCATION_CHANGE &&
        type !== ACTION_TYPES.GUI.NOTIFICATIONS_TAB &&
        type !== ACTION_TYPES.MODAL.TOGGLE_NOTIFICATIONS &&
        type !== ACTION_TYPES.LOAD_NEXT_CONTENT_REQUEST &&
        type !== ACTION_TYPES.TRACK.EVENT) ||
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
  const shouldTrack = _.get(action, 'payload.isNotificationsActive', true)
  const pageProps = {}
  if (shouldTrack && (type === LOCATION_CHANGE ||
      type === ACTION_TYPES.GUI.NOTIFICATIONS_TAB ||
      type === ACTION_TYPES.LOAD_NEXT_CONTENT_REQUEST ||
      type === ACTION_TYPES.MODAL.TOGGLE_NOTIFICATIONS)) {
    if (type === ACTION_TYPES.GUI.NOTIFICATIONS_TAB) {
      pageProps.path = `/notifications/${_.get(action, 'payload.activeTabType', '')}`
    } else if (type === ACTION_TYPES.MODAL.TOGGLE_NOTIFICATIONS) {
      const lastTabType = store.getState().gui.activeNotificationsTabType
      pageProps.path = `/notifications/${lastTabType === 'all' ? '' : lastTabType}`
    }
    if (window.analytics) {
      window.analytics.page(pageProps)
    }
    if (window.ga) {
      window.ga('send', 'pageview')
    }
    return next(action)
  }

  return next(action)
}

