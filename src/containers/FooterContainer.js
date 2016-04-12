import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE } from '../constants/action_types'
import { GUI } from '../constants/gui_types'
import { findLayoutMode } from '../reducers/gui'
import { Footer } from '../components/footer/Footer'

class FooterContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isPaginatoring: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
    username: PropTypes.string,
  }

  // TODO: Should the container just dispatch a scrollToTop action and let some
  // other object which keeps track of the current template deal with the
  // offset? We then wouldn't have to deal with the offset in here. It would
  // also mean we wouldn't have to pass in username from App or listen to
  // state.routing.location.pathname in mapStateToProps. We could then call
  // scrollToTop from anywhere (home key, from the Navbar, etc.).
  onClickScrollToTop = () => {
    const { pathname, username } = this.props
    if (typeof window === 'undefined') { return }
    const offset = (username || /\/settings/.test(pathname)) ?
      Math.round((window.innerWidth * 0.5625)) - 200 : 0
    window.scrollTo(0, offset)
  }

  onClickToggleLayoutMode = () => {
    const { dispatch, isGridMode } = this.props
    const newMode = isGridMode ? 'list' : 'grid'
    dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  }

  render() {
    const { isGridMode, isPaginatoring } = this.props
    const props = {
      isGridMode,
      isPaginatoring,
      onClickScrollToTop: this.onClickScrollToTop,
      onClickToggleLayoutMode: this.onClickToggleLayoutMode,
    }
    return <Footer { ...props } />
  }
}

const mapStateToProps = (state) => {
  const isPaginatoring = state.stream.type === LOAD_NEXT_CONTENT_REQUEST &&
    GUI.viewportDeviceSize === 'mobile'
  const currentMode = findLayoutMode(state.gui.modes)
  return {
    isGridMode: get(currentMode, 'mode', true) === 'grid',
    isPaginatoring,
    pathname: state.routing.location.pathname,
  }
}

export default connect(mapStateToProps)(FooterContainer)

