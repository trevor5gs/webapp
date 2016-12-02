/* eslint-disable no-constant-condition */
import { actionChannel, fork, select, take } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import get from 'lodash/get'
import * as ACTION_TYPES from '../constants/action_types'
import { selectActiveNotificationsType } from '../selectors/gui'

let shouldCallInitialTrackPage = false

const pageTrackTypes = [
  ACTION_TYPES.GUI.NOTIFICATIONS_TAB,
  ACTION_TYPES.GUI.TOGGLE_NOTIFICATIONS,
  ACTION_TYPES.LOAD_NEXT_CONTENT_REQUEST,
  ACTION_TYPES.TRACK.INITIAL_PAGE,
  LOCATION_CHANGE,
]

function* trackEvent() {
  while (true) {
    const action = yield take(ACTION_TYPES.TRACK.EVENT)
    const { label, options } = action.payload
    if (window.analytics) {
      window.analytics.track(label, options)
    }
  }
}

function* trackPage(pageTrackChannel) {
  while (true) {
    const action = yield take(pageTrackChannel)
    const pageProps = {}
    if ((action.type === ACTION_TYPES.LOCATION_CHANGE ||
      action.type === ACTION_TYPES.TRACK.INITIAL_PAGE) && window.analytics) {
      shouldCallInitialTrackPage = true
    }
    if (action.type === ACTION_TYPES.GUI.NOTIFICATIONS_TAB) {
      pageProps.path = `/notifications/${get(action, 'payload.activeTabType', '')}`
    } else if (action.type === ACTION_TYPES.GUI.TOGGLE_NOTIFICATIONS) {
      const lastTabType = yield select(selectActiveNotificationsType)
      pageProps.path = `/notifications/${lastTabType === 'all' ? '' : lastTabType}`
    }
    if (shouldCallInitialTrackPage) {
      window.analytics.page(pageProps)
    }
  }
}

export default function* analytics() {
  const pageTrackChannel = yield actionChannel(pageTrackTypes)
  yield [
    fork(trackEvent),
    fork(trackPage, pageTrackChannel),
  ]
}

