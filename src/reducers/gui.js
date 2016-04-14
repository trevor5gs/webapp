import _ from 'lodash'

import { LOCATION_CHANGE } from 'react-router-redux'
import {
  AUTHENTICATION,
  BEACONS,
  GUI,
  HEAD_FAILURE,
  HEAD_SUCCESS,
  LOAD_STREAM_SUCCESS,
  PROFILE,
  SET_LAYOUT_MODE,
} from '../constants/action_types'


let location = {}
const oldDate = new Date()
oldDate.setFullYear(oldDate.getFullYear() - 2)
// order matters for matching routes
const initialState = {
  activeNotificationsTabType: 'all',
  currentStream: '/following',
  isOffsetLayout: false,
  history: {},
  lastNotificationCheck: oldDate.toUTCString(),
  modes: [
    { label: 'root', mode: 'grid', regex: '^\/$' },
    { label: 'discover', mode: 'grid', regex: '\/discover|\/explore' },
    { label: 'following', mode: 'grid', regex: '\/following' },
    { label: 'invitations', mode: 'list', regex: '\/invitations' },
    { label: 'onboarding', mode: 'grid', regex: '\/onboarding' },
    { label: 'notifications', mode: 'list', regex: '\/notifications' },
    { label: 'search', mode: 'grid', regex: '\/search|\/find' },
    { label: 'settings', mode: 'list', regex: '\/settings' },
    { label: 'starred', mode: 'list', regex: '\/starred' },
    { label: 'staff', mode: 'list', regex: '\/staff' },
    { label: 'posts', mode: 'list', regex: '\/[\\w\\-]+\/post\/.+' },
    { label: 'users/following', mode: 'grid', regex: '\/[\\w\\-]+\/following' },
    { label: 'users/followers', mode: 'grid', regex: '\/[\\w\\-]+\/followers' },
    { label: 'users/loves', mode: 'grid', regex: '\/[\\w\\-]+\/loves' },
    { label: 'users', mode: 'list', regex: '\/[\\w\\-]+' },
  ],
  newNotificationContent: false,
}

export function findLayoutMode(modes) {
  for (const mode of modes) {
    const regex = new RegExp(mode.regex)
    if (regex.test(location.pathname)) {
      return mode
    }
  }
  return modes[modes.length - 1]
}

const STREAMS_WHITELIST = [
  /^\/discover$/,
  /^\/following$/,
  /^\/starred$/,
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
    case HEAD_FAILURE:
      return { ...state, newNotificationContent: false }
    case HEAD_SUCCESS:
      if (action.payload.serverResponse.status === 204) {
        return { ...state, newNotificationContent: true }
      }
      return state
    case AUTHENTICATION.LOGOUT:
      return { ...state, discoverKeyType: null }
    case LOAD_STREAM_SUCCESS:
      if (action.meta && /\/notifications/.test(action.meta.resultKey)) {
        return {
          ...state,
          newNotificationContent: false,
          lastNotificationCheck: new Date().toUTCString(),
        }
      }
      return state
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
      return { ...state }
    case GUI.NOTIFICATIONS_TAB:
      return { ...state, activeNotificationsTabType: action.payload.activeTabType }
    case GUI.SET_SCROLL:
      newState.history[action.payload.key] = { ...action.payload }
      return newState
    case GUI.SET_IS_OFFSET_LAYOUT:
      return { ...state, isOffsetLayout: action.payload.isOffsetLayout }
    case GUI.BIND_DISCOVER_KEY:
      return { ...newState, discoverKeyType: action.payload.type }
    default:
      return state
  }
}

// this is used for testing in StreamComponent_test
export function setLocation(loc) {
  location = loc
}

