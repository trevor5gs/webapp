import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function searchForPosts(terms) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: {
      endpoint: api.searchPosts({
        per_page: api.PER_PAGE,
        terms: window.encodeURIComponent(terms),
      }),
    },
    meta: {
      defaultMode: 'grid',
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asGrid: StreamRenderables.postsAsGrid,
        asList: StreamRenderables.postsAsList,
      },
    },
  }
}

export function searchForUsers(terms) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: {
      endpoint: api.searchUsers({
        per_page: api.PER_PAGE,
        terms: window.encodeURIComponent(terms),
      }),
    },
    meta: {
      defaultMode: 'grid',
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asGrid: StreamRenderables.usersAsGrid,
        asList: StreamRenderables.usersAsList,
      },
    },
  }
}

