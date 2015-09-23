import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as api from '../networking/api'

let cachedCommunity
let cachedPeople

export function loadCommunities() {
  if (cachedCommunity) {
    cachedCommunity.payload.endpoint = null
    return cachedCommunity
  }
  const cache =  {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.communitiesPath, vo: {} },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.onboardingCommunities },
  }

  cachedCommunity = {
    ...cache,
    ...{ type: ACTION_TYPES.LOAD_STREAM_SUCCESS },
  }
  return cache
}


export function loadAwesomePeople() {
  if (cachedPeople) {
    cachedPeople.payload.endpoint = null
    return cachedPeople
  }
  const cache = {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.awesomePeoplePath, vo: {} },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.onboardingPeople },
  }

  cachedPeople = {
    ...cache,
    ...{ type: ACTION_TYPES.LOAD_STREAM_SUCCESS },
  }
  return cache
}

export function relationshipBatchSave(ids, priority = 'friend') {
  return {
    type: ACTION_TYPES.POST_JSON,
    meta: { mappingType: MAPPING_TYPES.RELATIONSHIPS },
    payload: {
      method: 'POST',
      endpoint: api.relationshipBatchPath,
      body: JSON.stringify({ user_ids: ids, priority: priority }),
    },
  }
}

