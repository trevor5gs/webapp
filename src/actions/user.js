import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function loadUserDetail(username) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.userDetail(username), vo: {} },
    meta: {
      defaultMode: 'list',
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.userDetailAsList,
        asGrid: StreamRenderables.userDetailAsGrid,
      },
    },
  }
}

export function loadUserPosts(username, type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.userResources(username, type), vo: {} },
    meta: {
      defaultMode: 'list',
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
    },
  }
}

export function loadUserUsers(username, type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.userResources(username, type), vo: {} },
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

export function loadUserAvatars(endpoint, resultKey) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint, vo: {} },
    meta: {
      defaultMode: 'grid',
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.userAvatars,
        asGrid: StreamRenderables.userAvatars,
      },
      resultKey,
    },
  }
}

