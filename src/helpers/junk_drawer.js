import { set } from 'lodash'
import { decamelizeKeys } from 'humps'
import store from '../store'
import { requestPushSubscription, saveProfile } from '../actions/profile'
import { isElloAndroid } from '../vendor/jello'
import { fetchLoggedInPromos, fetchLoggedOutPromos } from '../actions/promotions'

export function preferenceToggleChanged(obj) {
  const newObj = { ...obj }
  if (newObj.hasOwnProperty('is_public')) {
    if (!newObj.is_public) {
      newObj.has_reposting_enabled = false
      newObj.has_sharing_enabled = false
    }
  }
  store.dispatch(saveProfile(decamelizeKeys(newObj)))
}

if (typeof window !== 'undefined') {
  window.registerAndroidNotifications = (registrationId,
                                         bundleId,
                                         marketingVersion,
                                         buildVersion) => {
    store.dispatch(
      requestPushSubscription(registrationId, bundleId, marketingVersion, buildVersion)
    )
  }

  if (isElloAndroid()) {
    AndroidInterface.webAppLoaded()
  }
}

export function loadPromotions(isLoggedIn, callback) {
  const fetchPromoAction = isLoggedIn ? fetchLoggedInPromos() : fetchLoggedOutPromos()
  set(fetchPromoAction, 'meta.successAction', callback)
  set(fetchPromoAction, 'meta.failureAction', callback)
  store.dispatch(fetchPromoAction)
}

