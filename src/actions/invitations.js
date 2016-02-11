import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function loadInvitedUsers() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.invite(), vo: {} },
    meta: {
      mappingType: MAPPING_TYPES.INVITATIONS,
      renderStream: {
        asList: StreamRenderables.usersAsInviteeList,
        asGrid: StreamRenderables.usersAsInviteeGrid,
      },
    },
  }
}

export function inviteUsers(emails) {
  return {
    type: ACTION_TYPES.INVITATIONS.INVITE,
    payload: {
      endpoint: api.invite(),
      method: 'POST',
      body: { email: emails },
    },
    meta: {
      mappingType: MAPPING_TYPES.INVITATIONS,
    },
  }
}

