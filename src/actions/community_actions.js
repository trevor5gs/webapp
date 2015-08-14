import * as mappingTypes from '../constants/mapping_types'
import * as renderFunctions from '../components/Renderables'

export function loadChannels() {
  return {
    type: 'LOAD_STREAM',
    payload: { endpoint: `/_data/channels.json`, vo: {} },
    meta: { mappingType: mappingTypes.USERS, renderStream: renderFunctions.channels }
  }
}

export function loadAwesomePeople() {
  return {
    type: 'LOAD_STREAM',
    payload: { endpoint: `/_data/awesome_people.json`, vo: {} },
    meta: { mappingType: mappingTypes.USERS, renderStream: renderFunctions.simpleUserGrid }
  }
}

