import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { set } from 'lodash'
import { scrollToTop } from '../vendor/scrolling'
import { ADD_NEW_IDS_TO_RESULT, SET_LAYOUT_MODE } from '../constants/action_types'
import { SESSION_KEYS } from '../constants/application_types'
import { logout } from '../actions/authentication'
import { setIsProfileMenuActive, toggleNotifications } from '../actions/gui'
import { checkForNewNotifications } from '../actions/notifications'
import { openOmnibar } from '../actions/omnibar'
import { updateRelationship } from '../actions/relationships'
import { loadFriends, loadNoise } from '../actions/stream'
import { NavbarLoggedIn, NavbarLoggedOut } from '../components/navbar/Navbar'
import { getDiscoverAction } from '../containers/DiscoverContainer'
import Session from '../vendor/session'

class NavbarContainer extends Component {

  static propTypes = {
    currentStream: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isGridMode: PropTypes.bool,
    isProfileMenuActive: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isNotificationsActive: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
    routerParams: PropTypes.shape({
      type: PropTypes.string,
    }).isRequired,
  }

  componentWillMount() {
    this.checkForNotifications()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate(prevProps) {
    if (typeof window === 'undefined' || !prevProps.pathname || !this.props.pathname) { return }
    if (prevProps.pathname !== this.props.pathname) {
      this.checkForNotifications()
    }
  }

  componentWillUnmount() {
    this.deactivateProfileMenu()
  }

  onClickAvatar = () => {
    const { isProfileMenuActive } = this.props
    return isProfileMenuActive ? this.deactivateProfileMenu() : this.activateProfileMenu()
  }

  onClickDocument = () => {
    this.deactivateProfileMenu()
  }

  onClickNotification = (e) => {
    if (e) { e.preventDefault() }
    const { dispatch, isNotificationsActive } = this.props
    dispatch(toggleNotifications({ isActive: !isNotificationsActive }))
  }

  onClickLoadMorePosts = () => {
    const { dispatch } = this.props
    dispatch({ type: ADD_NEW_IDS_TO_RESULT })
    scrollToTop()
  }

  onClickNavbarMark = () => {
    const { currentStream, dispatch, pathname, routerParams } = this.props
    if (currentStream === pathname) {
      if (/^\/discover/.test(pathname)) {
        if (routerParams.type) {
          dispatch(getDiscoverAction(routerParams.type))
        }
      } else if (/^\/following$/.test(pathname)) {
        dispatch(loadFriends())
      } else if (/^\/starred/.test(pathname)) {
        dispatch(loadNoise())
      }
      scrollToTop()
    }
  }

  onClickOmniButton = () => {
    const { dispatch } = this.props
    dispatch(openOmnibar())
    scrollToTop()
  }

  onClickToggleLayoutMode = () => {
    const { dispatch, isGridMode } = this.props
    const newMode = isGridMode ? 'list' : 'grid'
    dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  }

  onDragOverOmniButton = (e) => {
    e.preventDefault()
    this.onClickOmniButton()
  }

  onDragOverStreamLink = (e) => {
    e.preventDefault()
    e.target.classList.add('hasDragOver')
  }

  onDragLeaveStreamLink = (e) => {
    e.target.classList.remove('hasDragOver')
  }

  onDropStreamLink = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.target.classList.remove('hasDragOver')
    if (e.dataTransfer.types.indexOf('application/json') > -1) {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.userId && data.priority) {
        const newPriority = e.target.getAttribute('href') === '/starred' ? 'noise' : 'friend'
        this.props.dispatch(updateRelationship(data.userId, newPriority, data.priority))
      }
    }
  }

  // TODO: probably need to handle this a bit better
  onLogOut = () => {
    const { dispatch } = this.props
    this.deactivateProfileMenu()
    const logoutAction = logout()
    set(logoutAction, 'meta.successAction', push('/enter'))
    dispatch(logoutAction)
  }

  // if we're viewing notifications, don't change the lightning-bolt link.
  // on any other page, we have the notifications link go back to whatever
  // category you were viewing last.
  getNotificationCategory() {
    const { pathname } = this.props
    if (pathname.match(/^\/notifications\b/)) { return '' }
    return (
      Session.getItem(SESSION_KEYS.NOTIFICATIONS_FILTER) ?
        `/${Session.getItem(SESSION_KEYS.NOTIFICATIONS_FILTER)}` : ''
    )
  }

  checkForNotifications() {
    const { dispatch, isLoggedIn } = this.props
    if (isLoggedIn) { dispatch(checkForNewNotifications()) }
  }

  activateProfileMenu() {
    const { dispatch, isProfileMenuActive } = this.props
    if (isProfileMenuActive) { return }
    dispatch(setIsProfileMenuActive({ isActive: true }))
    requestAnimationFrame(() => {
      document.addEventListener('click', this.onClickDocument)
    })
  }

  deactivateProfileMenu() {
    const { dispatch, isProfileMenuActive } = this.props
    if (!isProfileMenuActive) { return }
    document.removeEventListener('click', this.onClickDocument)
    dispatch(setIsProfileMenuActive({ isActive: false }))
  }

  render() {
    const { isLoggedIn } = this.props
    if (isLoggedIn) {
      return (
        <NavbarLoggedIn
          {...this.props}
          notificationCategory={this.getNotificationCategory()}
          onClickAvatar={this.onClickAvatar}
          onClickDocument={this.onClickDocument}
          onClickLoadMorePosts={this.onClickLoadMorePosts}
          onClickNavbarMark={this.onClickNavbarMark}
          onClickNotification={this.onClickNotification}
          onClickOmniButton={this.onClickOmniButton}
          onClickToggleLayoutMode={this.onClickToggleLayoutMode}
          onDragLeaveStreamLink={this.onDragLeaveStreamLink}
          onDragOverOmniButton={this.onDragOverOmniButton}
          onDragOverStreamLink={this.onDragOverStreamLink}
          onDropStreamLink={this.onDropStreamLink}
          onLogOut={this.onLogOut}
        />
      )
    }
    return (
      <NavbarLoggedOut
        {...this.props}
        onClickLoadMorePosts={this.onClickLoadMorePosts}
        onClickNavbarMark={this.onClickNavbarMark}
      />
    )
  }
}

function mapStateToProps(state) {
  const { authentication, gui, json, profile, routing } = state
  const currentStream = gui.currentStream
  const isLoggedIn = authentication.isLoggedIn
  const pathname = routing.location.pathname
  const result = json.pages ? json.pages[pathname] : null
  const hasLoadMoreButton = Boolean(result && result.newIds)

  if (isLoggedIn) {
    return {
      avatar: profile.avatar,
      deviceSize: gui.deviceSize,
      currentStream,
      hasLoadMoreButton,
      isGridMode: gui.isGridMode,
      isLayoutToolHidden: gui.isLayoutToolHidden,
      isLoggedIn,
      isNotificationsActive: gui.isNotificationsActive,
      isNotificationsUnread: gui.isNotificationsUnread,
      isProfileMenuActive: gui.isProfileMenuActive,
      pathname,
      username: profile.username,
    }
  }
  return {
    currentStream,
    hasLoadMoreButton,
    isLoggedIn,
    pathname,
  }
}

export default connect(mapStateToProps)(NavbarContainer)

