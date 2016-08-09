import { decamelizeKeys } from 'humps'
import store from '../store'
import { requestPushSubscription, saveProfile } from '../actions/profile'
import { isElloAndroid } from '../vendor/jello'
import { trackEvent } from '../actions/tracking'

export function preferenceToggleChanged(obj) {
  const newObj = { ...obj }
  if ({}.hasOwnProperty.call(newObj, 'is_public')) {
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

export function dispatchTrackEvent(label, options = {}) {
  store.dispatch(trackEvent(label, options))
}

