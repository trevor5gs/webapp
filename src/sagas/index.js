import { fork } from 'redux-saga/effects'
import authenticationSaga from './authentication'
import editorSaga from './editor'
import pushSubscriptionSaga from './push_subscription'
import requesterSaga from './requester'
import uploaderSaga from './uploader'

export function* serverRoot() {
  yield [
    fork(requesterSaga),
  ]
}

export default function* root() {
  yield [
    fork(authenticationSaga),
    fork(editorSaga),
    fork(pushSubscriptionSaga),
    fork(requesterSaga),
    fork(uploaderSaga),
  ]
}
