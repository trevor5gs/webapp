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

