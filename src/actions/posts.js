import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as StreamFilters from '../components/streams/StreamFilters'
import * as api from '../networking/api'

export function loadPostDetail(token) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.postDetail(token), vo: {} },
    meta: { mappingType: MAPPING_TYPES.POSTS, renderStream: StreamRenderables.postDetail },
  }
}

