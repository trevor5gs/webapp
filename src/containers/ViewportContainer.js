import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import {
  selectCoverOffset,
  selectInnerHeight,
  selectInnerWidth,
  selectIsAuthenticationView,
  selectIsCoverHidden,
  selectIsNavbarFixed,
  selectIsNavbarHidden,
  selectIsNavbarSkippingTransition,
  selectIsNotificationsActive,
  selectIsOffsetLayout,
  selectIsOnboardingView,
  selectIsProfileMenuActive,
  selectScrollDirectionOffset,
} from '../selectors/gui'
import { selectPathname } from '../selectors/routing'
import { setIsOffsetLayout, setScrollState, setViewportSizeAttributes } from '../actions/gui'
import { addScrollObject, removeScrollObject } from '../components/viewport/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../components/viewport/ResizeComponent'
import { Viewport } from '../components/viewport/Viewport'


function mapStateToProps(state) {
  return {
    coverOffset: selectCoverOffset(state),
    innerHeight: selectInnerHeight(state),
    innerWidth: selectInnerWidth(state),
    isAuthenticationView: selectIsAuthenticationView(state),
    isCoverHidden: selectIsCoverHidden(state),
    isNavbarFixed: selectIsNavbarFixed(state),
    isNavbarHidden: selectIsNavbarHidden(state),
    isNavbarSkippingTransition: selectIsNavbarSkippingTransition(state),
    isNotificationsActive: selectIsNotificationsActive(state),
    isOffsetLayout: selectIsOffsetLayout(state),
    isOnboardingView: selectIsOnboardingView(state),
    isProfileMenuActive: selectIsProfileMenuActive(state),
    offset: selectScrollDirectionOffset(state),
    pathname: selectPathname(state),
  }
}

/* eslint-disable react/no-unused-prop-types */
class ViewportContainer extends Component {
  static propTypes = {
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    innerHeight: PropTypes.number,
    innerWidth: PropTypes.number,
    isAuthenticationView: PropTypes.bool,
    isCoverHidden: PropTypes.bool,
    isNavbarFixed: PropTypes.bool,
    isNavbarHidden: PropTypes.bool,
    isNavbarSkippingTransition: PropTypes.bool,
    isNotificationsActive: PropTypes.bool,
    isOffsetLayout: PropTypes.bool,
    isOnboardingView: PropTypes.bool,
    isProfileMenuActive: PropTypes.bool,
    offset: PropTypes.number,
    pathname: PropTypes.string.isRequired,
    routerParams: PropTypes.shape({
      username: PropTypes.string,
      token: PropTypes.string,
    }).isRequired,
  }

  componentWillMount() {
    this.hasResized = false
    this.scrollYAtDirectionChange = null
  }

  componentDidMount() {
    addResizeObject(this)
    addScrollObject(this)
    this.updateIsOffsetLayout()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pathname === this.props.pathname) { return }
    this.updateIsOffsetLayout()
  }

  componentWillUnmount() {
    removeResizeObject(this)
    removeScrollObject(this)
  }

  onResize(resizeAttributes) {
    const { innerHeight: prevHeight, innerWidth: prevWidth } = this.props
    const { innerHeight: nextHeight, innerWidth: nextWidth } = resizeAttributes
    if (!this.hasResized || (prevHeight !== nextHeight || prevWidth !== nextWidth)) {
      this.hasResized = true
      this.props.dispatch(setViewportSizeAttributes(resizeAttributes))
    }
  }

  onScrollTop() {
    const { dispatch, isNavbarFixed } = this.props
    if (isNavbarFixed) {
      dispatch(setScrollState({
        isCoverHidden: false,
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

  // TODO: Lots of optimizations here I'm sure
  onScroll(scrollProperties) {
    const { scrollY, scrollDirection } = scrollProperties
    const {
      dispatch,
      coverOffset,
      isCoverHidden,
      isNavbarFixed,
      isNavbarHidden,
      isNavbarSkippingTransition,
    } = this.props
    let nextIsFixed = isNavbarFixed
    let nextIsHidden = isNavbarHidden
    let nextIsSkippingTransition = isNavbarSkippingTransition

    // Whether scroll has surpassed the height of the cover offset
    const nextIsCoverHidden = scrollY >= coverOffset

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
    // If something changed dispatch it for the reducer
    if (isCoverHidden !== nextIsCoverHidden ||
        isNavbarFixed !== nextIsFixed || isNavbarHidden !== nextIsHidden ||
        isNavbarSkippingTransition !== nextIsSkippingTransition) {
      dispatch(setScrollState({
        isCoverHidden: nextIsCoverHidden,
        isFixed: nextIsFixed,
        isHidden: nextIsHidden,
        isSkippingTransition: nextIsSkippingTransition,
      }))
    }
  }

  updateIsOffsetLayout() {
    const { isOffsetLayout, pathname, routerParams: { username, token } } = this.props
    const isUserDetailOrSettings = (username && !token) || pathname === '/settings'
    if (isOffsetLayout !== isUserDetailOrSettings) {
      this.props.dispatch(setIsOffsetLayout({ isOffsetLayout: isUserDetailOrSettings }))
    }
  }

  render() {
    return <Viewport {...this.props} />
  }

}
/* eslint-enable react/no-unused-prop-types */

export default connect(mapStateToProps)(ViewportContainer)

