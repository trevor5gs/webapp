import _ from 'lodash'

import { LOCATION_CHANGE } from 'react-router-redux'
import { BEACONS, PROFILE, SET_LAYOUT_MODE } from '../constants/action_types'


let location = {}
// order matters for matching routes
const initialState = {
  modes: [
    { label: 'root', mode: 'grid', regex: /^\/$/ },
    { label: 'discover', mode: 'grid', regex: /\/discover|\/explore/ },
    { label: 'following', mode: 'grid', regex: /\/following/ },
    { label: 'invitations', mode: 'list', regex: /\/invitations/ },
    { label: 'onboarding', mode: 'grid', regex: /\/onboarding/ },
    { label: 'search', mode: 'grid', regex: /\/search|\/find/ },
    { label: 'starred', mode: 'list', regex: /\/starred/ },
    { label: 'posts', mode: 'list', regex: /\/[\w\-]+\/post\/.+/ },
    { label: 'users/following', mode: 'grid', regex: /\/[\w\-]+\/following/ },
    { label: 'users/followers', mode: 'grid', regex: /\/[\w\-]+\/followers/ },
    { label: 'users/loves', mode: 'grid', regex: /\/[\w\-]+\/loves/ },
    { label: 'users', mode: 'list', regex: /\/[\w\-]+/ },
  ],
  currentStream: '/following',
}

// TODO: figure out why the users regex doesn't work properly
export function findLayoutMode(modes) {
  for (const mode of modes) {
    const regEx = new RegExp(mode.regex)
    if (regEx.test(location.pathname)) {
      return mode
    }
  }
  return modes[modes.length - 1]
}

const STREAMS_WHITELIST = [
  /discover/,
  /following/,
  /starred/,
]

export function gui(state = initialState, action = { type: '' }) {
  const newState = { ...state }
  let mode = null
  let pathname = null
  switch (action.type) {
    case BEACONS.LAST_DISCOVER_VERSION:
      return { ...state, lastDiscoverBeaconVersion: action.payload.version }
    case BEACONS.LAST_FOLLOWING_VERSION:
      return { ...state, lastFollowingBeaconVersion: action.payload.version }
    case BEACONS.LAST_STARRED_VERSION:
      return { ...state, lastStarredBeaconVersion: action.payload.version }
    case PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    case SET_LAYOUT_MODE:
      mode = findLayoutMode(newState.modes)
      if (mode.mode === action.payload.mode) return state
      mode.mode = action.payload.mode
      return newState
    case LOCATION_CHANGE:
      location = action.payload
      pathname = location.pathname

      if (_.some(STREAMS_WHITELIST, re => re.test(pathname))) {
        return { ...state, currentStream: pathname }
      }

      return state
    default:
      return state
  }
}
