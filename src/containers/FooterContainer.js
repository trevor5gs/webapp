import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { scrollToTop, scrollToOffsetTop } from '../vendor/scrollTop'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE } from '../constants/action_types'
import { Footer } from '../components/footer/Footer'

class FooterContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    hasLayoutTool: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isOffsetLayout: PropTypes.bool.isRequired,
    isPaginatoring: PropTypes.bool,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onClickScrollToTop = () => {
    const { isOffsetLayout } = this.props
    return isOffsetLayout ? scrollToOffsetTop() : scrollToTop()
  }

  onClickToggleLayoutMode = () => {
    const { dispatch, isGridMode } = this.props
    const newMode = isGridMode ? 'list' : 'grid'
    dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  }

  render() {
    const { hasLayoutTool, isGridMode, isPaginatoring } = this.props
    const props = {
      hasLayoutTool,
      isGridMode,
      isPaginatoring,
      onClickScrollToTop: this.onClickScrollToTop,
      onClickToggleLayoutMode: this.onClickToggleLayoutMode,
    }
    return <Footer { ...props } />
  }
}

const mapStateToProps = (state) => {
  const { gui, stream } = state
  const isPaginatoring = stream.type === LOAD_NEXT_CONTENT_REQUEST && gui.deviceSize === 'mobile'
  return {
    hasLayoutTool: gui.hasLayoutTool,
    isGridMode: gui.isGridMode,
    isOffsetLayout: gui.isOffsetLayout,
    isPaginatoring,
  }
}

export default connect(mapStateToProps)(FooterContainer)

