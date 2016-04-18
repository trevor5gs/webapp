import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
// import { get } from 'lodash'
// import { SET_LAYOUT_MODE } from '../constants/action_types'
import { NavbarLoggedOut } from '../components/navbar/Navbar'

class NavbarContainer extends Component {

  static propTypes = {
    currentStream: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    // isOffsetLayout: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
  }

  componentWillMount() {
    // this.checkForNotifications()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  // onClickToggleLayoutMode = () => {
  //   const { dispatch, isGridMode } = this.props
  //   const newMode = isGridMode ? 'list' : 'grid'
  //   dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  // }

  render() {
    const props = {
      ...this.props,
      // onClickToggleLayoutMode: this.onClickToggleLayoutMode,
    }
    return <NavbarLoggedOut { ...props } />
  }
}

const mapStateToProps = (state) => {
  const { authentication, gui, profile, routing } = state

  const currentStream = gui.currentStream
  const isLoggedIn = authentication.isLoggedIn
  // const isOffsetLayout = gui.isOffsetLayout
  const pathname = routing.location.pathname

  if (isLoggedIn) {
    return {
      avatar: profile.avatar,
      currentStream,
      isLoggedIn,
      // isNotificationsActive: modal.isNotificationsActive,
      // isOffsetLayout,
      pathname,
      username: profile.username,
    }
  }
  return {
    currentStream,
    isLoggedIn,
    pathname,
  }
}

export default connect(mapStateToProps)(NavbarContainer)

