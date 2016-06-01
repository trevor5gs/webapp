import { decamelizeKeys } from 'humps'
import store from '../store'
import { registerForGCM, saveProfile } from '../actions/profile'

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
  window.registerAndroidNotifications = (registrationId) => {
    store.dispatch(registerForGCM(registrationId))
  }
}

