import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function loadChannels() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: 'http://ello.dev:5000/api/v2/interest_categories/members?name=onboarding&per_page=20', vo: {} },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.onboardingChannels },
  }
}

export function loadAwesomePeople() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: 'http://ello.dev:5000/api/v2/interest_categories/members?name=all', vo: {} },
    meta: { mappingType: MAPPING_TYPES.USERS, renderStream: StreamRenderables.onboardingPeople },
  }
}

