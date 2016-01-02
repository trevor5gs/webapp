import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function loadInvitedUsers() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.invite(), vo: {} },
    meta: {
      defaultMode: 'grid',
      mappingType: MAPPING_TYPES.INVITATIONS,
      renderStream: {
        asList: StreamRenderables.usersAsInviteeList,
        asGrid: StreamRenderables.usersAsInviteeGrid,
      },
    },
  }
}

