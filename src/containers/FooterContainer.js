import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE } from '../constants/action_types'
import { GUI } from '../constants/gui_types'
import { findLayoutMode } from '../reducers/gui'
import { scrollToTop } from '../components/interface/Viewport'
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

  onClickScrollToTop = () => {
    const { isOffsetLayout } = this.props
    scrollToTop({ isOffsetLayout })
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

