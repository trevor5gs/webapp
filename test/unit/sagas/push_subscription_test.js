import { AUTHENTICATION, PROFILE } from '../../../src/constants/action_types'
import { loginPushSubscribe, logoutPushUnsubscribe } from '../../../src/sagas/push_subscription'
import {
  bundleIdSelector,
  isLoggedInSelector,
  registrationIdSelector,
} from '../../../src/sagas/selectors'
import {
  registerForGCM,
  requestPushSubscription,
  unregisterForGCM,
} from '../../../src/actions/profile'

describe('push subscription saga', function () {
  const regId = 'my awesome registration id'

  describe('#loginPushSubscribe', function () {
    it('registers for GCM when logged in', function () {
      const pushAction = requestPushSubscription(regId)
      const pushHandler = loginPushSubscribe()
      expect(pushHandler).to.take(PROFILE.REQUEST_PUSH_SUBSCRIPTION)
      expect(pushHandler.next(pushAction)).to.select(isLoggedInSelector)
      expect(pushHandler.next(true)).to.put(registerForGCM(regId))
    })

    it('defers registration for GCM until logged in', function () {
      const pushAction = requestPushSubscription(regId)
      const pushHandler = loginPushSubscribe()
      expect(pushHandler).to.take(PROFILE.REQUEST_PUSH_SUBSCRIPTION)
      expect(pushHandler.next(pushAction)).to.select(isLoggedInSelector)
      expect(pushHandler.next(false)).to.take(AUTHENTICATION.USER_SUCCESS)
      expect(pushHandler).to.put(registerForGCM(regId))
    })
  })

  describe('#logoutPushUnsubscribe', function () {
    it('unregisters push subscription on logout or profile delete', function () {
      const pushAction = requestPushSubscription(regId)
      const pushHandler = logoutPushUnsubscribe()
      expect(pushHandler).to.take([AUTHENTICATION.LOGOUT, PROFILE.DELETE])
      expect(pushHandler.next(pushAction)).to.select(registrationIdSelector)
      expect(pushHandler.next('reg_id')).to.select(bundleIdSelector)
      expect(pushHandler.next('bundle_id')).to.put(unregisterForGCM('reg_id', 'bundle_id'))
    })
  })
})

