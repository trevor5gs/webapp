// import * as MAPPING_TYPES from '../constants/mapping_types'
import { PROFILE } from '../constants/action_types'


export function validateUsername() {
}

export function validateEmail() {
}

export function saveProfile(payload) {
  return {
    type: PROFILE.SAVE,
    payload: payload,
    meta: { },
  }
}

export function savePreferences() {
}

export function saveAvatar() {
}

export function saveWallpaper() {
}

export function deleteAccountForReal() {
}

