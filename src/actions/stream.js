import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as StreamFilters from '../components/streams/StreamFilters'
import * as api from '../networking/api'

export function loadFriends() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.friendStream(), vo: {} },
    meta: {
      mappingType: MAPPING_TYPES.ACTIVITIES,
      renderStream: StreamRenderables.postsAsGrid,
      resultFilter: StreamFilters.postsFromActivities,
    },
  }
}

export function loadNoise() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.noiseStream(), vo: {} },
    meta: {
      mappingType: MAPPING_TYPES.ACTIVITIES,
      renderStream: StreamRenderables.postsAsList,
      resultFilter: StreamFilters.postsFromActivities,
    },
  }
}

