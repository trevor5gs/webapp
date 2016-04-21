import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { scrollToTop, scrollToOffsetTop } from '../vendor/scrollTop'
import { setNavbarState, setViewportSizeAttributes } from '../actions/gui'
import { addScrollObject, removeScrollObject } from '../components/viewport/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../components/viewport/ResizeComponent'
import { Viewport } from '../components/viewport/Viewport'

class ViewportContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    innerHeight: PropTypes.number,
    innerWidth: PropTypes.number,
    isNavbarFixed: PropTypes.bool,
    isNavbarHidden: PropTypes.bool,
    isNavbarSkippingTransition: PropTypes.bool,
    isNotificationsActive: PropTypes.bool,
    isOffsetLayout: PropTypes.bool,
    isProfileMenuActive: PropTypes.bool,
    offset: PropTypes.number,
    pathname: PropTypes.string.isRequired,
  }

  componentWillMount() {
    this.scrollYAtDirectionChange = null
  }

  componentDidMount() {
    const { isOffsetLayout } = this.props
    addResizeObject(this)
    addScrollObject(this)
    return isOffsetLayout ? scrollToOffsetTop() : scrollToTop()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUnmount() {
    removeResizeObject(this)
    removeScrollObject(this)
  }

  onResize(resizeAttributes) {
    const { innerHeight: prevHeight, innerWidth: prevWidth } = this.props
    const { innerHeight: nextHeight, innerWidth: nextWidth } = resizeAttributes
    if (prevHeight !== nextHeight || prevWidth !== nextWidth) {
      this.props.dispatch(setViewportSizeAttributes(resizeAttributes))
    }
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
    if (scrollY >= this.props.offset) {
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
    if (scrollY >= this.props.offset && !isNavbarFixed) {
      nextIsFixed = true
      nextIsHidden = true
      nextIsSkippingTransition = true
    }

    // Scroll just changed directions so it's about to either be shown or hidden
    if (scrollY >= this.props.offset && this.scrollYAtDirectionChange) {
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

  render() {
    return <Viewport { ...this.props } />
  }

}

const mapStateToProps = (state) => {
  const { gui, modal, routing } = state
  return {
    innerHeight: gui.innerHeight,
    innerWidth: gui.innerWidth,
    isNavbarFixed: gui.isNavbarFixed,
    isNavbarHidden: gui.isNavbarHidden,
    isNavbarSkippingTransition: gui.isNavbarSkippingTransition,
    isNotificationsActive: modal.isNotificationsActive,
    isOffsetLayout: gui.isOffsetLayout,
    isProfileMenuActive: gui.isProfileMenuActive,
    offset: gui.coverOffset ? gui.coverOffset - 80 : 160,
    pathname: routing.location.pathname,
  }
}

export default connect(mapStateToProps)(ViewportContainer)

