import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as api from '../networking/api'

export function loadUserDetail(username) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.userDetail(username), vo: {} },
    meta: {
      defaultMode: 'list',
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.userDetail,
        asGrid: StreamRenderables.userDetail,
      },
    },
  }
}

export function loadUserAvatars(endpoint, resultKey) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: endpoint, vo: {} },
    meta: {
      defaultMode: 'grid',
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.userAvatars,
        asGrid: StreamRenderables.userAvatars,
      },
      resultKey,
    },
  }
}

