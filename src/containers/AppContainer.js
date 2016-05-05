import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { loadProfile } from '../actions/profile'
import DevTools from '../components/devtools/DevTools'
import { AppHelmet } from '../components/helmets/AppHelmet'
import Modal from '../components/modals/Modal'
import Omnibar from '../components/omnibar/Omnibar'
import { addGlobalDrag, removeGlobalDrag } from '../components/viewport/GlobalDrag'
import AnalyticsContainer from '../containers/AnalyticsContainer'
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUnmount() {
    removeGlobalDrag()
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
        <ViewportContainer routerParams={ params } />
        { isLoggedIn ? <Omnibar /> : null }
        { children }
        <NavbarContainer routerParams={ params } />
        <FooterContainer />
        { isLoggedIn ? <EditorToolsContainer /> : null }
        <Modal />
        <DevTools />
        <KeyboardContainer />
        <AnalyticsContainer />
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

const mapStateToProps = (state, ownProps) => {
  const { authentication } = state
  return {
    authentication,
    pathname: ownProps.location.pathname,
  }
}

export default connect(mapStateToProps)(AppContainer)

