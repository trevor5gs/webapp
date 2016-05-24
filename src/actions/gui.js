import { GUI } from '../constants/action_types'

export function setActiveUserFollowingType(type) {
  return {
    type: GUI.SET_ACTIVE_USER_FOLLOWING_TYPE,
    payload: { tab: type },
  }
}

export function setIsOffsetLayout({ isOffsetLayout }) {
  return {
    type: GUI.SET_IS_OFFSET_LAYOUT,
    payload: {
      isOffsetLayout,
    },
  }
}

export function setLastDiscoverBeaconVersion({ version }) {
  return {
    type: GUI.SET_LAST_DISCOVER_BEACON_VERSION,
    payload: {
      version,
    },
  }
}

export function setScrollState({ isCoverHidden, isFixed, isHidden, isSkippingTransition }) {
  return {
    type: GUI.SET_SCROLL_STATE,
    payload: {
      isCoverHidden,
      isNavbarFixed: isFixed,
      isNavbarHidden: isHidden,
      isNavbarSkippingTransition: isSkippingTransition,
    },
  }
}

export function setViewportSizeAttributes(resizeAttributes) {
  return {
    type: GUI.SET_VIEWPORT_SIZE_ATTRIBUTES,
    payload: {
      ...resizeAttributes,
    },
  }
}

