import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function loadChannels() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: '/test/mock/data/channels.json', vo: {} },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.onboardingChannels },
  }
}

export function loadAwesomePeople() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: '/test/mock/data/awesome_people.json', vo: {} },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.onboardingPeople },
  }
}

