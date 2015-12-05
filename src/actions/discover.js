import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamFilters from '../components/streams/StreamFilters'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function loadDiscoverUsers(type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.discoverUsers(type) },
    meta: {
      defaultMode: 'grid',
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
      resultFilter: StreamFilters.mostRecentPostsFromUsers,
    },
  }
}

export function loadCommunities() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.communitiesPath(), vo: {} },
    meta: {
      defaultMode: 'grid',
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsCards,
        asGrid: StreamRenderables.usersAsCards,
      },
    },
  }
}

export function loadFeaturedUsers() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.awesomePeoplePath(), vo: {} },
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

