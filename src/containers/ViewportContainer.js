import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { setNavbarState, setViewportDeviceSize } from '../actions/gui'
import { addScrollObject, removeScrollObject } from '../components/interface/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../components/interface/ResizeComponent'
import { Viewport } from '../components/viewport/Viewport'

class ViewportContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isNavbarFixed: PropTypes.bool.isRequired,
    isNavbarHidden: PropTypes.bool.isRequired,
    isNavbarSkippingTransition: PropTypes.bool.isRequired,
    isOffsetLayout: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
  }

  componentWillMount() {
    this.scrollYAtDirectionChange = null
    this.offset = -80
    this.viewportDeviceSize = 'mobile'
  }

  componentDidMount() {
    addResizeObject(this)
    addScrollObject(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUnmount() {
    removeResizeObject(this)
    removeScrollObject(this)
  }

  onResize({ coverOffset, viewportDeviceSize }) {
    this.offset = coverOffset - 80
    this.props.dispatch(setViewportDeviceSize({ size: viewportDeviceSize }))
  }

  onScrollTop() {
    const { dispatch, isNavbarFixed } = this.props
    if (isNavbarFixed) {
      dispatch(setNavbarState({
        isFixed: false,
        isHidden: false,
        isSkippingTransition: false,
      }))
    }
  }

  onScrollDirectionChange(scrollProperties) {
    const { scrollY } = scrollProperties
    if (scrollY >= this.offset) {
      this.scrollYAtDirectionChange = scrollY
    }
  }

  onScroll(scrollProperties) {
    const { scrollY, scrollDirection } = scrollProperties
    const { dispatch, isNavbarFixed, isNavbarHidden, isNavbarSkippingTransition } = this.props
    let nextIsFixed = isNavbarFixed
    let nextIsHidden = isNavbarHidden
    let nextIsSkippingTransition = isNavbarSkippingTransition

    // Going from absolute to fixed positioning
    if (scrollY >= this.offset && !isNavbarFixed) {
      nextIsFixed = true
      nextIsHidden = true
      nextIsSkippingTransition = true
    }

    // Scroll just changed directions so it's about to either be shown or hidden
    if (scrollY >= this.offset && this.scrollYAtDirectionChange) {
      const distance = Math.abs(scrollY - this.scrollYAtDirectionChange)
      const delay = scrollDirection === 'down' ? 20 : 80
      const isScrollingDown = scrollDirection === 'down'

      if (distance >= delay) {
        nextIsHidden = isScrollingDown
        nextIsSkippingTransition = false
        this.scrollYAtDirectionChange = null
      }
    }
    if (isNavbarFixed !== nextIsFixed || isNavbarHidden !== nextIsHidden ||
        isNavbarSkippingTransition !== nextIsSkippingTransition) {
      dispatch(setNavbarState({
        isFixed: nextIsFixed,
        isHidden: nextIsHidden,
        isSkippingTransition: nextIsSkippingTransition,
      }))
    }
  }

  // Add the viewport component then things like scrolling,
  // resizing, etc.
  render() {
    return <Viewport { ...this.props } />
  }

}
const mapStateToProps = (state) => {
  const { gui, routing } = state
  return {
    isNavbarFixed: gui.isNavbarFixed,
    isNavbarHidden: gui.isNavbarHidden,
    isNavbarSkippingTransition: gui.isNavbarSkippingTransition,
    isOffsetLayout: gui.isOffsetLayout,
    pathname: routing.location.pathname,
  }
}

export default connect(mapStateToProps)(ViewportContainer)

