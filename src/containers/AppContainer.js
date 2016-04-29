import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { loadProfile } from '../actions/profile'
import { setIsOffsetLayout } from '../actions/gui'
import AnalyticsContainer from '../containers/AnalyticsContainer'
import DevTools from '../components/devtools/DevTools'
import { AppHelmet } from '../components/helmets/AppHelmet'
import Modal from '../components/modals/Modal'
import Omnibar from '../components/omnibar/Omnibar'
import { addGlobalDrag, removeGlobalDrag } from '../components/viewport/GlobalDrag'
import EditorToolsContainer from '../containers/EditorToolsContainer'
import FooterContainer from '../containers/FooterContainer'
import KeyboardContainer from '../containers/KeyboardContainer'
import NavbarContainer from '../containers/NavbarContainer'
import ViewportContainer from '../containers/ViewportContainer'

class AppContainer extends Component {

  static propTypes = {
    authentication: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    editorStore: PropTypes.object.isRequired,
    isOffsetLayout: PropTypes.bool,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
    params: PropTypes.shape({
      username: PropTypes.string,
      token: PropTypes.string,
      type: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    editorStore: {},
  }

  componentDidMount() {
    addGlobalDrag()
    this.updateIsOffsetLayout()
    if (get(this.props, 'authentication.isLoggedIn')) {
      const { dispatch } = this.props
      dispatch(loadProfile())
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevAuthentication = this.props.authentication
    const { authentication, dispatch } = nextProps
    if (authentication &&
        !prevAuthentication.isLoggedIn &&
        authentication.isLoggedIn) {
      dispatch(loadProfile())
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname === this.props.location.pathname) { return }
    this.updateIsOffsetLayout()
  }

  componentWillUnmount() {
    removeGlobalDrag()
  }

  // TODO: Maybe move this out to a Viewport object?
  updateIsOffsetLayout() {
    const { isOffsetLayout, location: { pathname }, params: { username, token } } = this.props
    const isUserDetailOrSettings = (username && !token) || pathname === '/settings'
    if (isOffsetLayout !== isUserDetailOrSettings) {
      this.props.dispatch(setIsOffsetLayout({ isOffsetLayout: isUserDetailOrSettings }))
    }
  }

  render() {
    const { authentication, children, params, pathname } = this.props
    const { isLoggedIn } = authentication
    const appClasses = classNames(
      'AppContainer',
      { isLoggedIn },
      { isLoggedOut: !isLoggedIn },
    )
    return (
      <section className={ appClasses }>
        <AppHelmet pathname={ pathname } />
        <ViewportContainer />
        { isLoggedIn ? <Omnibar /> : null }
        { children }
        <NavbarContainer routerParams={ params } />
        <FooterContainer />
        { isLoggedIn ? <EditorToolsContainer /> : null }
        <Modal />
        <DevTools />
        <template>
          <KeyboardContainer />
          <AnalyticsContainer />
        </template>
      </section>
    )
  }
}

AppContainer.preRender = (store) => {
  const state = store.getState()
  if (state.authentication && state.authentication.isLoggedIn) {
    store.dispatch(loadProfile())
  }
}

function mapStateToProps(state, ownProps) {
  return {
    authentication: state.authentication,
    pathname: ownProps.location.pathname,
    isOffsetLayout: state.gui.isOffsetLayout,
  }
}

export default connect(mapStateToProps)(AppContainer)

