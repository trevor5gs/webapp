import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as api from '../networking/api'

export function loadProfile() {
  return {
    type: ACTION_TYPES.PROFILE.LOAD,
    meta: {},
    payload: { endpoint: api.profilePath },
  }
}

export function loadUserDetail(username) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.userDetail(username), vo: {} },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.userDetail },
  }
}

export function saveProfile(users) {
  return {
    type: ACTION_TYPES.PROFILE.SAVE,
    meta: {},
    payload: {
      method: 'PATCH',
      endpoint: api.profilePath,
      body: JSON.stringify(users),
    },
  }
}

export function savePreferences() {
}

export function validateUsername() {
}

export function validateEmail() {
}

export function uploadAsset(type, file) {
  return {
    type: type,
    meta: {},
    payload: {
      endpoint: api.profilePath,
      file: file,
    },
  }
}

export function temporaryAvatarCreated(b64Asset) {
  return {
    type: ACTION_TYPES.PROFILE.TMP_AVATAR_CREATED,
    meta: {},
    payload: { tmpAvatar: b64Asset},
  }
}

export function temporaryCoverCreated(b64Asset) {
  return {
    type: ACTION_TYPES.PROFILE.TMP_COVER_CREATED,
    meta: {},
    payload: { tmpCover: b64Asset},
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
    dispatch(uploadAsset(ACTION_TYPES.PROFILE.SAVE_AVATAR, file))
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
    dispatch(uploadAsset(ACTION_TYPES.PROFILE.SAVE_COVER, file))
    reader.readAsDataURL(file)
  }
}

export function deleteAccountForReal() {
}

