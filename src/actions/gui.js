import { GUI } from '../constants/action_types'

export function setIsOffsetLayout({ isOffsetLayout }) {
  return {
    type: GUI.SET_IS_OFFSET_LAYOUT,
    payload: {
      isOffsetLayout,
    },
  }
}

export function setFollowingTab(followingTab) {
  return {
    type: GUI.SET_FOLLOWING_TAB,
    payload: { tab: followingTab },
  }
}

export function setViewportDeviceSize({ size }) {
  return {
    type: GUI.SET_VIEWPORT_DEVICE_SIZE,
    payload: {
      viewportDeviceSize: size,
    },
  }
}

export function setNavbarState({ isFixed, isHidden, isSkippingTransition }) {
  return {
    type: GUI.SET_NAVBAR_STATE,
    payload: {
      isNavbarFixed: isFixed,
      isNavbarHidden: isHidden,
      isNavbarSkippingTransition: isSkippingTransition,
    },
  }
}

