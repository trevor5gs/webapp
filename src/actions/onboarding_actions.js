import * as mappingTypes from '../constants/mapping_types'
import * as renderFunctions from '../components/Renderables'
import * as TYPE from '../constants/action_types'

export function loadChannels() {
  return {
    type: TYPE.LOAD_STREAM,
    payload: { endpoint: `/_data/channels.json`, vo: {} },
    meta: { mappingType: mappingTypes.USERS, renderStream: renderFunctions.channels }
  }
}

export function loadAwesomePeople() {
  return {
    type: TYPE.LOAD_STREAM,
    payload: { endpoint: `/_data/awesome_people.json`, vo: {} },
    meta: { mappingType: mappingTypes.USERS, renderStream: renderFunctions.simpleUserGrid }
  }
}

export function loadProfileHeader() {
  return {
    type: TYPE.STATIC_PAGE,
    meta: { renderStream: renderFunctions.profileHeaderView }
  }
}

export function loadProfileAvatar() {
  return {
    type: TYPE.STATIC_PAGE,
    meta: { renderStream: renderFunctions.profileAvatarView }
  }
}

