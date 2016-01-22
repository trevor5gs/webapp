import React from 'react'
import { LOAD_STREAM, PROFILE } from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamFilters from '../components/streams/StreamFilters'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import { ErrorState } from '../components/errors/Errors'

export function loadProfile() {
  return {
    type: PROFILE.LOAD,
    meta: {},
    payload: { endpoint: api.profilePath() },
  }
}

export function saveProfile(params) {
  return {
    type: PROFILE.SAVE,
    meta: {},
    payload: {
      method: 'PATCH',
      endpoint: api.profilePath(),
      body: JSON.stringify(params),
    },
  }
}

export function deleteProfile() {
  return {
    type: PROFILE.DELETE,
    meta: {},
    payload: {
      method: 'DELETE',
      endpoint: api.profilePath(),
    },
  }
}

export function availableToggles() {
  return {
    type: LOAD_STREAM,
    meta: {
      mappingType: MAPPING_TYPES.CATEGORIES,
      renderStream: {
        asList: StreamRenderables.profileToggles,
        asGrid: StreamRenderables.profileToggles,
        asError: <ErrorState/>,
      },
    },
    payload: {
      endpoint: api.profileAvailableToggles(),
    },
  }
}

export function checkAvailability(vo) {
  return {
    type: PROFILE.AVAILABILITY,
    meta: {},
    payload: {
      method: 'POST',
      body: JSON.stringify(vo),
      endpoint: api.availability(),
    },
  }
}

export function requestInvite(email) {
  return {
    type: PROFILE.REQUEST_INVITE,
    meta: {},
    payload: {
      method: 'POST',
      body: JSON.stringify({ email }),
      endpoint: api.invite(),
    },
  }
}

export function uploadAsset(type, file) {
  return {
    type,
    meta: {},
    payload: {
      endpoint: api.profilePath(),
      file,
    },
  }
}

export function temporaryAvatarCreated(b64Asset) {
  return {
    type: PROFILE.TMP_AVATAR_CREATED,
    meta: {},
    payload: { tmp: { url: b64Asset } },
  }
}

export function temporaryCoverCreated(b64Asset) {
  return {
    type: PROFILE.TMP_COVER_CREATED,
    meta: {},
    payload: { tmp: { url: b64Asset } },
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

export function blockedUsers() {
  return {
    type: LOAD_STREAM,
    payload: {
      endpoint: api.profileBlockedUsers(),
    },
    meta: {
      defaultMode: 'list',
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.blockedMutedUserList,
        asGrid: StreamRenderables.blockedMutedUserList,
      },
      resultFilter: StreamFilters.userResults,
      resultKey: 'blocked',
    },
  }
}

export function mutedUsers() {
  return {
    type: LOAD_STREAM,
    payload: {
      endpoint: api.profileMutedUsers(),
    },
    meta: {
      defaultMode: 'list',
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.blockedMutedUserList,
        asGrid: StreamRenderables.blockedMutedUserList,
      },
      resultFilter: StreamFilters.userResults,
      resultKey: 'muted',
    },
  }
}

export function deleteAccountForReal() {
}

