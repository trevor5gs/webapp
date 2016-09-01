import { createSelector } from 'reselect'
import { get } from 'lodash'
import { selectParamsUsername } from '../selectors'

// state.gui.xxx
export const selectActiveUserFollowingType = (state) => get(state, 'gui.activeUserFollowingType')
export const selectActiveNotificationsType = (state) => get(state, 'gui.activeNotificationsType')
export const selectColumnWidth = (state) => get(state, 'gui.columnWidth')
export const selectContentWidth = (state) => get(state, 'gui.contentWidth')
export const selectCoverDPI = (state) => get(state, 'gui.coverDPI')
export const selectCoverOffset = (state) => get(state, 'gui.coverOffset')
export const selectCurrentStream = (state) => get(state, 'gui.currentStream')
export const selectDeviceSize = (state) => get(state, 'gui.deviceSize')
export const selectDiscoverKeyType = (state) => get(state, 'gui.discoverKeyType')
export const selectInnerHeight = (state) => get(state, 'gui.innerHeight')
export const selectInnerWidth = (state) => get(state, 'gui.innerWidth')
export const selectIsAuthenticationView = (state) => get(state, 'gui.isAuthenticationView')
export const selectIsCompleterActive = (state) => get(state, 'gui.isCompleterActive')
export const selectIsCoverHidden = (state) => get(state, 'gui.isCoverHidden')
export const selectIsGridMode = (state) => get(state, 'gui.isGridMode')
export const selectIsLayoutToolHidden = (state) => get(state, 'gui.isLayoutToolHidden')
export const selectIsNavbarFixed = (state) => get(state, 'gui.isNavbarFixed')
export const selectIsNavbarHidden = (state) => get(state, 'gui.isNavbarHidden')
export const selectIsNavbarSkippingTransition = (state) => get(state, 'gui.isNavbarSkippingTransition') // eslint-disable-line
export const selectIsNotificationsActive = (state) => get(state, 'gui.isNotificationsActive')
export const selectIsNotificationsUnread = (state) => get(state, 'gui.isNotificationsUnread')
export const selectIsOffsetLayout = (state) => get(state, 'gui.isOffsetLayout')
export const selectIsOmnibarActive = (state) => get(state, 'gui.isOmnibarActive')
export const selectIsOnboardingView = (state) => get(state, 'gui.isOnboardingView')
export const selectIsProfileMenuActive = (state) => get(state, 'gui.isProfileMenuActive')
export const selectIsTextToolsActive = (state) => get(state, 'gui.isTextToolsActive')
export const selectSaidHelloTo = (state) => get(state, 'gui.saidHelloTo')
export const selectTextToolsCoordinates = (state) => get(state, 'gui.textToolsCoordinates')
export const selectTextToolsStates = (state) => get(state, 'gui.textToolsStates')

// Memoized Selectors
export const selectCommentOffset = createSelector(
  [selectDeviceSize], (deviceSize) =>
    (deviceSize === 'mobile' ? 40 : 60)
)

export const selectIsMobileGridStream = createSelector(
  [selectDeviceSize, selectIsGridMode], (deviceSize, isGridMode) =>
    deviceSize === 'mobile' && isGridMode
)

export const selectHasSaidHelloTo = createSelector(
  [selectSaidHelloTo, selectParamsUsername], (saidHelloTo, username) =>
    saidHelloTo.indexOf(username) !== -1
)

export const selectScrollDirectionOffset = createSelector(
  [selectCoverOffset], (coverOffset) =>
    (coverOffset ? coverOffset - 80 : 160)
)

