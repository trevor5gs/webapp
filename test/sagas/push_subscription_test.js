import { expect } from '../spec_helper'
import { AUTHENTICATION, PROFILE } from '../../src/constants/action_types'
import { pushSubscriptionSaga } from '../../src/sagas/push_subscription'
import { isLoggedInSelector } from '../../src/sagas/selectors'
import {
  registerForGCM,
  requestPushSubscription,
} from '../../src/actions/profile'

describe.only('push subscription saga', function () {
  const regId = 'my awesome registration id'

  describe('the saga itself', function () {
    it('registers for GCM when logged in', function () {
      const pushAction = requestPushSubscription(regId)
      const pushHandler = pushSubscriptionSaga()
      expect(pushHandler).to.take(PROFILE.REQUEST_PUSH_SUBSCRIPTION)
      expect(pushHandler.next(pushAction)).to.select(isLoggedInSelector)
      expect(pushHandler.next(true)).to.put(registerForGCM(regId))
    })

    it('defers registration for GCM until logged in', function () {
      const pushAction = requestPushSubscription(regId)
      const pushHandler = pushSubscriptionSaga()
      expect(pushHandler).to.take(PROFILE.REQUEST_PUSH_SUBSCRIPTION)
      expect(pushHandler.next(pushAction)).to.select(isLoggedInSelector)
      expect(pushHandler.next(false)).to.take(AUTHENTICATION.USER_SUCCESS)
      expect(pushHandler).to.put(registerForGCM(regId))
    })
  })
})

