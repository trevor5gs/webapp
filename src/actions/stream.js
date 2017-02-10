import React from 'react'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamFilters from '../components/streams/StreamFilters'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import { ZeroFollowingStream } from '../components/zeros/Zeros'

export function loadFriends() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.friendStream() },
    meta: {
      mappingType: MAPPING_TYPES.ACTIVITIES,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
        asZero: <ZeroFollowingStream />,
      },
      resultFilter: StreamFilters.postsFromActivities,
    },
  }
}

export default loadFriends

