import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as api from '../networking/api'

export function searchForPosts(terms) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.searchPosts({ terms: terms, per_page: api.PER_PAGE }) },
    meta: { mappingType: MAPPING_TYPES.POSTS, renderStream: StreamRenderables.postsAsGrid },
  }
}

export function searchForUsers(terms) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.searchUsers({ terms: terms, per_page: api.PER_PAGE }) },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.onboardingPeople },
  }
}

