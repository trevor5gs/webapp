import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function loadRecommended() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: '/test/mock/data/discovery_listing_recommended_users.json', vo: {} },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.postsAsGrid },
  }
}

