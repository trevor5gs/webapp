import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as api from '../networking/api'

export function loadUserDetail(username) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.userDetail(username), vo: {} },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.userDetail },
  }
}

export function loadUserAvatars(endpoint, resultKey) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: endpoint, vo: {} },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.userAvatars, resultKey },
  }
}

