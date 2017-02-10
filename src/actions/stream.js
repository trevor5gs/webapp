import React from 'react'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { followingStream } from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import { ZeroFollowingStream } from '../components/zeros/Zeros'

export function loadFollowing() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: followingStream() },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
        asZero: <ZeroFollowingStream />,
      },
    },
  }
}

export default loadFollowing

