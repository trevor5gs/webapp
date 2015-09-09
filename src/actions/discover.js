import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as StreamFilters from '../components/streams/StreamFilters'

export function loadRecommended() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: '/data/activity_streams_friend_stream.json', vo: {} },
    meta: { mappingType: MAPPING_TYPES.ACTIVITIES, renderStream: StreamRenderables.postsAsGrid, resultFilter: StreamFilters.postsFromActivities },
  }
}

