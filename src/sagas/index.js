import { fork } from 'redux-saga/effects'
import authenticationSaga from './authentication'
import pushSubscriptionSaga from './push_subscription'
import requesterSaga from './requester'
import uploaderSaga from './uploader'
import { isElloAndroid } from '../vendor/jello'

export function* serverRoot() {
  yield [
    fork(requesterSaga),
  ]
}

export default function* root() {
  yield [
    fork(authenticationSaga),
    fork(requesterSaga),
    fork(uploaderSaga),
  ]
  if (isElloAndroid()) {
    yield fork(pushSubscriptionSaga)
  }
}
