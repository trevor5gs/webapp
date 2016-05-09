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

