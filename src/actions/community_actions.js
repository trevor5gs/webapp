import * as mappingTypes from '../constants/mapping_types'

export function loadCommunities() {
  return {
    type: 'LOAD_STREAM',
    payload: { endpoint: `/_data/communities.json`, vo: {} },
    meta: { mappingType: mappingTypes.USERS }
  }
}

export function loadAwesomePeople() {
  return {
    type: 'LOAD_STREAM',
    payload: { endpoint: `/_data/awesome_people.json`, vo: {} },
    meta: { mappingType: mappingTypes.USERS }
  }
}

