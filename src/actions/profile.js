import React from 'react'
import { replace } from 'react-router-redux'
import { LOAD_STREAM, PROFILE } from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamFilters from '../components/streams/StreamFilters'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import { ErrorState } from '../components/errors/Errors'

export function loadProfile() {
  return {
    type: PROFILE.LOAD,
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      updateResult: false,
    },
    payload: { endpoint: api.profilePath() },
  }
}

export function signUpUser(email, username, password, invitationCode) {
  return {
    type: PROFILE.SIGNUP,
    meta: {},
    payload: {
      method: 'POST',
      endpoint: api.signupPath(),
      body: {
        email,
        username,
        password,
        invitation_code: invitationCode,
      },
    },
  }
}

export function saveProfile(params) {
  return {
    type: PROFILE.SAVE,
    meta: {},
    payload: {
      method: 'PATCH',
      endpoint: api.profilePath(),
      body: params,
    },
  }
}

export function deleteProfile() {
  return {
    type: PROFILE.DELETE,
    meta: {
      successAction: replace('/'),
    },
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
      resultKey: '/settings/available-toggles',
      renderStream: {
        asList: StreamRenderables.profileToggles,
        asGrid: StreamRenderables.profileToggles,
        asError: <ErrorState />,
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
    meta: { original: vo },
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

export function temporaryAssetCreated(type, objectURL) {
  return {
    type,
    meta: {},
    payload: { tmp: { url: objectURL } },
  }
}

// There are 2 branches here. One to Base64 encode the asset for immediate
// feedback. The other sends it off to S3 and friends.
export function saveAvatar(file) {
  return {
    type: PROFILE.SAVE_AVATAR,
    meta: {},
    payload: {
      endpoint: api.profilePath(),
      file,
    },
  }
}

// Basically the same things as saveAvatar above
export function saveCover(file) {
  return {
    type: PROFILE.SAVE_COVER,
    meta: {},
    payload: {
      endpoint: api.profilePath(),
      file,
    },
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
      resultKey: '/settings/blocked',
      updateKey: '/profile/blocked',
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
      resultKey: '/settings/muted',
      updateKey: '/profile/muted',
    },
  }
}

export function exportData() {
  return {
    type: PROFILE.EXPORT,
    meta: {},
    payload: {
      endpoint: api.profileExport(),
      method: 'POST',
    },
  }
}

export function registerForGCM(regId) {
  return {
    type: PROFILE.REGISTER_FOR_GCM,
    payload: {
      endpoint: api.registerForGCM(regId),
      method: 'POST',
    },
  }
}

