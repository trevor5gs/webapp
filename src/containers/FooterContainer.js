import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import {
  selectDeviceSize,
  selectIsGridMode,
  selectIsLayoutToolHidden,
  selectIsOffsetLayout,
} from '../selectors/gui'
import { selectStreamType } from '../selectors/stream'
import { scrollToTop, scrollToOffsetTop } from '../vendor/scrolling'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE } from '../constants/action_types'
import { Footer } from '../components/footer/Footer'

function mapStateToProps(state) {
  const deviceSize = selectDeviceSize(state)
  const streamType = selectStreamType(state)
  return {
    isGridMode: selectIsGridMode(state),
    isLayoutToolHidden: selectIsLayoutToolHidden(state),
    isOffsetLayout: selectIsOffsetLayout(state),
    isPaginatoring: streamType === LOAD_NEXT_CONTENT_REQUEST && deviceSize === 'mobile',
  }
}

class FooterContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLayoutToolHidden: PropTypes.bool.isRequired,
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
    const { isLayoutToolHidden, isGridMode, isPaginatoring } = this.props
    const props = {
      isLayoutToolHidden,
      isGridMode,
      isPaginatoring,
      onClickScrollToTop: this.onClickScrollToTop,
      onClickToggleLayoutMode: this.onClickToggleLayoutMode,
    }
    return <Footer {...props} />
  }
}

export default connect(mapStateToProps)(FooterContainer)

