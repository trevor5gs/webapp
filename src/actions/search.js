import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function searchForPosts(terms) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.searchPosts({ terms: window.encodeURIComponent(terms), per_page: api.PER_PAGE }) },
    meta: {
      defaultMode: 'grid',
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
    },
  }
}

export function searchForUsers(terms) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.searchUsers({ terms: window.encodeURIComponent(terms), per_page: api.PER_PAGE }) },
    meta: {
      defaultMode: 'grid',
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsList,
        asGrid: StreamRenderables.usersAsGrid,
      },
    },
  }
}

