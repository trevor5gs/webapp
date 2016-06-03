/* eslint-disable no-constant-condition */
import { put, select, take } from 'redux-saga/effects'
import { registerForGCM } from '../actions/profile'
import { AUTHENTICATION, PROFILE } from '../constants/action_types'
import { isLoggedInSelector } from './selectors'

export default function* pushSubscription() {
  const action = yield take(PROFILE.REQUEST_PUSH_SUBSCRIPTION)
  const { buildVersion, bundleId, marketingVersion, registrationId } = action.payload
  if (yield select(isLoggedInSelector)) {
    yield put(registerForGCM(registrationId, bundleId, marketingVersion, buildVersion))
  } else {
    yield take(AUTHENTICATION.USER_SUCCESS)
    yield put(registerForGCM(registrationId, bundleId, marketingVersion, buildVersion))
  }
}

