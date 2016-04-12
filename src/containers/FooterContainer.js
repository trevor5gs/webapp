import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
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
    isOffsetLayout: PropTypes.bool.isRequired,
    isPaginatoring: PropTypes.bool,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  // TODO: Should just dispatch a scrollToTop action and let some other object
  // deal with scrolling. We could then call the scrollToTop action from
  // anywhere (home key, from the Navbar, etc.).
  onClickScrollToTop = () => {
    if (typeof window === 'undefined') { return }
    const offset = (this.props.isOffsetLayout) ? Math.round((window.innerWidth * 0.5625)) - 200 : 0
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
    isOffsetLayout: state.gui.isOffsetLayout,
    isPaginatoring,
  }
}

export default connect(mapStateToProps)(FooterContainer)

