import { PROFILE } from '../constants/action_types'
import * as api from '../api'

export function loadProfile() {
  return {
    type: PROFILE.LOAD,
    meta: {},
    payload: { endpoint: api.profilePath },
  }
}

export function validateUsername() {
}

export function validateEmail() {
}

export function saveProfile(users) {
  return {
    type: PROFILE.SAVE,
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

export function avatarWasSaved(payload) {
  return {
    type: PROFILE.AVATAR_WAS_SAVED,
    meta: {},
    payload: payload,
  }
}

// Base64 encode the avatar for immediate feedback. This will eventually need
// to send the asset to S3 and update the API from this action as well. Not
// sure if it's best to branch here or create a chain of them? Regardless it
// should null out the tmp property to remove that big ass string once we have
// image data returned from the API/S3.
export function saveAvatar(file) {
  return dispatch => {
    const reader = new FileReader()
    reader.onloadend = () => {
      dispatch(avatarWasSaved({ avatar: { tmp: reader.result }}))
    }
    reader.readAsDataURL(file)
  }
}

export function coverWasSaved(payload) {
  return {
    type: PROFILE.COVER_WAS_SAVED,
    meta: {},
    payload: payload,
  }
}

// Basically the same things as saveAvatar above
export function saveCover(file) {
  return dispatch => {
    const reader = new FileReader()
    reader.onloadend = () => {
      dispatch(coverWasSaved({ coverImage: { tmp: reader.result }}))
    }
    reader.readAsDataURL(file)
  }
}

export function deleteAccountForReal() {
}

