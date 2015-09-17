import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as api from '../api'

let cachedChannel
let cachedPeople

export function loadChannels() {
  if (cachedChannel) {
    cachedChannel.payload.endpoint = null
    return cachedChannel
  }
  const cache =  {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.channels, vo: {} },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.onboardingChannels },
  }

  cachedChannel = {
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

