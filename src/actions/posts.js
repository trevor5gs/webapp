import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as api from '../networking/api'

export function loadPostDetail(token) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.postDetail(token), vo: {} },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: StreamRenderables.postDetail,
    },
  }
}

export function lovePost(post) {
  return {
    type: ACTION_TYPES.POST.LOVE,
    payload: { endpoint: api.lovePost(post), method: 'POST', model: post },
    meta: { mappingType: MAPPING_TYPES.LOVES },
  }
}

export function unlovePost(post) {
  return {
    type: ACTION_TYPES.POST.LOVE,
    payload: { endpoint: api.unlovePost(post), method: 'DELETE', model: post },
    meta: {},
  }
}
