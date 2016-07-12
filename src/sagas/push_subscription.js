/* eslint-disable no-constant-condition */
import { fork, put, select, take } from 'redux-saga/effects'
import { registerForGCM, unregisterForGCM } from '../actions/profile'
import { AUTHENTICATION, PROFILE } from '../constants/action_types'
import {
  bundleIdSelector,
  isLoggedInSelector,
  registrationIdSelector,
} from './selectors'

export function* loginPushSubscribe() {
  const action = yield take(PROFILE.REQUEST_PUSH_SUBSCRIPTION)
  const { buildVersion, bundleId, marketingVersion, registrationId } = action.payload
  if (yield select(isLoggedInSelector)) {
    yield put(registerForGCM(registrationId, bundleId, marketingVersion, buildVersion))
  } else {
    yield take(AUTHENTICATION.USER_SUCCESS)
    yield put(registerForGCM(registrationId, bundleId, marketingVersion, buildVersion))
  }
}

export function* logoutPushUnsubscribe() {
  yield take([AUTHENTICATION.LOGOUT, PROFILE.DELETE])
  const registrationId = yield select(registrationIdSelector)
  const bundleId = yield select(bundleIdSelector)
  yield put(unregisterForGCM(registrationId, bundleId))
}

export default function* pushSubscription() {
  while (true) {
    yield [
      fork(loginPushSubscribe),
      fork(logoutPushUnsubscribe),
    ]
  }
}

