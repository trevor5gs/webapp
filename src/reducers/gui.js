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

const STREAMS_WHITELIST = [
  /^\/discover/,
  /^\/following$/,
  /^\/starred$/,
]

const NO_LAYOUT_TOOLS = [
  /^\/[\w\-]+\/post\/.+/,
  /^\/notifications\b/,
  /^\/settings\b/,
  /^\/onboarding\b/,
]

const findLayoutMode = (modes) => {
  for (const mode of modes) {
    const regex = new RegExp(mode.regex)
    if (regex.test(location.pathname)) {
      return mode
    }
  }
  return modes[modes.length - 1]
}

const _isGridMode = (modes) => {
  const mode = findLayoutMode(modes)
  if (!mode) { return null }
  return mode.mode === 'grid'
}

const initialSizeState = {
  columnCount: 2,
  columnWidth: 0,
  contentWidth: 0,
  coverDPI: 'xhdpi',
  coverOffset: 0,
  deviceSize: 'tablet',
  innerHeight: 0,
  innerWidth: 0,
}

const initialScrollState = {
  isCoverHidden: false,
  isNavbarFixed: false,
  isNavbarHidden: false,
  isNavbarSkippingTransition: false,
}

const initialState = {
  ...initialSizeState,
  ...initialScrollState,
  activeNotificationsType: 'all',
  activeUserFollowingType: 'friend',
  currentStream: '/discover',
  discoverKeyType: null,
  history: {},
  isGridMode: true,
  isLayoutToolHidden: false,
  isNotificationsUnread: false,
  isOffsetLayout: false,
  lastDiscoverBeaconVersion: '0',
  lastFollowingBeaconVersion: '0',
  lastNotificationCheck: oldDate.toUTCString(),
  lastStarredBeaconVersion: '0',
  // order matters for matching routes
  modes: [
    { label: 'root', mode: 'grid', regex: '^/$' },
    { label: 'discover', mode: 'grid', regex: '/discover|/explore' },
    { label: 'following', mode: 'grid', regex: '/following' },
    { label: 'invitations', mode: 'list', regex: '/invitations' },
    { label: 'onboarding', mode: 'grid', regex: '/onboarding' },
    { label: 'notifications', mode: 'list', regex: '/notifications' },
    { label: 'search', mode: 'grid', regex: '/search|/find' },
    { label: 'settings', mode: 'list', regex: '/settings' },
    { label: 'starred', mode: 'list', regex: '/starred' },
    { label: 'staff', mode: 'list', regex: '/staff' },
    { label: 'posts', mode: 'list', regex: '/[\\w\\-]+/post/.+' },
    { label: 'users/following', mode: 'grid', regex: '/[\\w\\-]+/following' },
    { label: 'users/followers', mode: 'grid', regex: '/[\\w\\-]+/followers' },
    { label: 'users/loves', mode: 'grid', regex: '/[\\w\\-]+/loves' },
    { label: 'users', mode: 'list', regex: '/[\\w\\-]+' },
  ],
}

export const gui = (state = initialState, action = { type: '' }) => {
  const newState = { ...state }
  let mode = null
  let pathname = null
  let isLayoutToolHidden = null
  switch (action.type) {
    case AUTHENTICATION.LOGOUT:
      return { ...state, discoverKeyType: null }
    case BEACONS.LAST_DISCOVER_VERSION:
      return { ...state, lastDiscoverBeaconVersion: action.payload.version }
    case BEACONS.LAST_FOLLOWING_VERSION:
      return { ...state, lastFollowingBeaconVersion: action.payload.version }
    case BEACONS.LAST_STARRED_VERSION:
      return { ...state, lastStarredBeaconVersion: action.payload.version }
    case GUI.BIND_DISCOVER_KEY:
      return { ...newState, discoverKeyType: action.payload.type }
    case GUI.NOTIFICATIONS_TAB:
      return { ...state, activeNotificationsType: action.payload.activeTabType }
    case GUI.SET_ACTIVE_USER_FOLLOWING_TYPE:
      return { ...newState, activeUserFollowingType: action.payload.tab }
    case GUI.SET_IS_OFFSET_LAYOUT:
      return { ...state, isOffsetLayout: action.payload.isOffsetLayout }
    case GUI.SET_SCROLL:
      newState.history[action.payload.key] = { ...action.payload }
      return newState
    case GUI.SET_SCROLL_STATE:
      return {
        ...state,
        isCoverHidden: _.get(action.payload, 'isCoverHidden', newState.isCoverHidden),
        isNavbarFixed: _.get(action.payload, 'isNavbarFixed', newState.isNavbarFixed),
        isNavbarHidden: _.get(action.payload, 'isNavbarHidden', newState.isNavbarHidden),
        isNavbarSkippingTransition:
          _.get(action.payload, 'isNavbarSkippingTransition', newState.isNavbarSkippingTransition),
      }
    case GUI.SET_VIEWPORT_SIZE_ATTRIBUTES:
      return { ...state, ...action.payload }
    case HEAD_FAILURE:
      return { ...state, isNotificationsUnread: false }
    case HEAD_SUCCESS:
      if (action.payload.serverResponse.status === 204) {
        return { ...state, isNotificationsUnread: true }
      }
      return state
    case LOAD_STREAM_SUCCESS:
      if (action.meta && /\/notifications/.test(action.meta.resultKey)) {
        return {
          ...state,
          isNotificationsUnread: false,
          lastNotificationCheck: new Date().toUTCString(),
        }
      }
      return state
    case LOCATION_CHANGE:
      location = action.payload
      pathname = location.pathname
      isLayoutToolHidden = _.some(NO_LAYOUT_TOOLS, pagex => pagex.test(pathname))
      if (_.some(STREAMS_WHITELIST, re => re.test(pathname))) {
        return {
          ...state,
          ...initialScrollState,
          currentStream: pathname,
          isLayoutToolHidden,
          isGridMode: _isGridMode(state.modes),
        }
      }
      return {
        ...state,
        ...initialScrollState,
        isLayoutToolHidden,
        isGridMode: _isGridMode(state.modes),
      }
    case PROFILE.DELETE_SUCCESS:
      return { ...initialState }
    case SET_LAYOUT_MODE:
      mode = findLayoutMode(newState.modes)
      if (mode.mode === action.payload.mode) return state
      mode.mode = action.payload.mode
      return { ...newState, isGridMode: action.payload.mode === 'grid' }
    default:
      return state
  }
}

// this is used for testing in StreamComponent_test
export const setLocation = (loc) => {
  location = loc
}

