import * as mappingTypes from '../constants/mapping_types'
import * as renderables from '../components/StreamRenderables'
import * as TYPE from '../constants/action_types'

export function loadChannels() {
  return {
    type: TYPE.LOAD_STREAM,
    payload: { endpoint: `/_data/channels.json`, vo: {} },
    meta: { mappingType: mappingTypes.USERS, renderStream: renderables.onboardingChannels }
  }
}

export function loadAwesomePeople() {
  return {
    type: TYPE.LOAD_STREAM,
    payload: { endpoint: `/_data/awesome_people.json`, vo: {} },
    meta: { mappingType: mappingTypes.USERS, renderStream: renderables.onboardingPeople }
  }
}

