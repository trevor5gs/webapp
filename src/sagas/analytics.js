/* eslint-disable no-constant-condition */
import { actionChannel, fork, take } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import * as ACTION_TYPES from '../constants/action_types'

const analyticsTypes = [
  ACTION_TYPES.GUI.NOTIFICATIONS_TAB,
  ACTION_TYPES.GUI.TOGGLE_NOTIFICATIONS,
  ACTION_TYPES.LOAD_NEXT_CONTENT_REQUEST,
  ACTION_TYPES.TRACK.EVENT,
  LOCATION_CHANGE,
]

function* handleEvent(analyticsChannel) {
  while (true) {
    const action = yield take(analyticsChannel)
    console.log('action', action)
  }
}

export default function* analytics() {
  const analyticsChannel = yield actionChannel(analyticsTypes)
  yield fork(handleEvent, analyticsChannel)
}

