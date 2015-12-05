import { PROFILE } from '../constants/action_types'
import * as api from '../networking/api'

export function loadProfile() {
  return {
    type: PROFILE.LOAD,
    meta: {},
    payload: { endpoint: api.profilePath() },
  }
}

export function saveProfile(users) {
  return {
    type: PROFILE.SAVE,
    meta: {},
    payload: {
      method: 'PATCH',
      endpoint: api.profilePath(),
      body: JSON.stringify(users),
    },
  }
}

export function savePreferences() {
}


export function requestInvite(vo) {
  const body = { email: [vo.email] }
  return {
    type: PROFILE.VALIDATE_EMAIL,
    meta: {},
    payload: {
      method: 'POST',
      body: JSON.stringify(body),
      endpoint: api.invite(),
    },
  }
}

export function validateUsername() {
}
export function validateEmail(vo) {
  return {
    type: PROFILE.VALIDATE_EMAIL,
    meta: {},
    payload: {
      method: 'POST',
      body: JSON.stringify(vo),
      endpoint: api.availability(vo),
    },
  }
}

export function uploadAsset(type, file) {
  return {
    type: type,
    meta: {},
    payload: {
      endpoint: api.profilePath(),
      file: file,
    },
  }
}

export function temporaryAvatarCreated(b64Asset) {
  return {
    type: PROFILE.TMP_AVATAR_CREATED,
    meta: {},
    payload: { tmpAvatar: b64Asset },
  }
}

export function temporaryCoverCreated(b64Asset) {
  return {
    type: PROFILE.TMP_COVER_CREATED,
    meta: {},
    payload: { tmpCover: b64Asset },
  }
}

// There are 2 branches here. One to Base64 encode the asset for immediate
// feedback. The other sends it off to S3 and friends.
export function saveAvatar(file) {
  return dispatch => {
    const reader = new FileReader()
    reader.onloadend = () => {
      dispatch(temporaryAvatarCreated(reader.result))
    }
    dispatch(uploadAsset(PROFILE.SAVE_AVATAR, file))
    reader.readAsDataURL(file)
  }
}

// Basically the same things as saveAvatar above
export function saveCover(file) {
  return dispatch => {
    const reader = new FileReader()
    reader.onloadend = () => {
      dispatch(temporaryCoverCreated(reader.result))
    }
    dispatch(uploadAsset(PROFILE.SAVE_COVER, file))
    reader.readAsDataURL(file)
  }
}

export function deleteAccountForReal() {
}

