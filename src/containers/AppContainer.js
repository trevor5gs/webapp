import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { get, isEqual, pick } from 'lodash'
import { selectPagination } from '../selectors'
import { getCategories } from '../actions/discover'
import { loadNotifications } from '../actions/notifications'
import { loadProfile } from '../actions/profile'
import DevTools from '../components/devtools/DevTools'
import { AppHelmet } from '../components/helmets/AppHelmet'
import Modal from '../components/modals/Modal'
import Omnibar from '../components/omnibar/Omnibar'
import { addGlobalDrag, removeGlobalDrag } from '../components/viewport/GlobalDrag'
import { startRefreshTimer } from '../components/viewport/RefreshOnFocus'
import AnalyticsContainer from '../containers/AnalyticsContainer'
import EditorToolsContainer from '../containers/EditorToolsContainer'
import FooterContainer from '../containers/FooterContainer'
import KeyboardContainer from '../containers/KeyboardContainer'
import NavbarContainer from '../containers/NavbarContainer'
import ViewportContainer from '../containers/ViewportContainer'

export function shouldContainerUpdate(thisProps, nextProps) {
  const pickProps = ['authentication', 'location', 'pagination', 'params']
  const thisCompare = pick(thisProps, pickProps)
  const nextCompare = pick(nextProps, pickProps)
  return !isEqual(thisCompare, nextCompare)
}

function mapStateToProps(state, props) {
  const { authentication } = state
  return {
    authentication,
    pagination: selectPagination(state, props),
    pathname: props.location.pathname,
  }
}

class AppContainer extends Component {

  static propTypes = {
    authentication: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    pagination: PropTypes.shape({
      next: PropTypes.string,
    }),
    pathname: PropTypes.string.isRequired,
    params: PropTypes.shape({
      username: PropTypes.string,
      token: PropTypes.string,
      type: PropTypes.string,
    }).isRequired,
  }

  static preRender = (store) => {
    const state = store.getState()
    if (state.authentication && state.authentication.isLoggedIn) {
      return Promise.all([
        store.dispatch(loadProfile()),
        store.dispatch(getCategories()),
      ])
    }
    return store.dispatch(getCategories())
  }

  componentDidMount() {
    addGlobalDrag()
    startRefreshTimer()
    const { dispatch } = this.props
    if (get(this.props, 'authentication.isLoggedIn')) {
      dispatch(loadProfile())
      dispatch(loadNotifications({ category: 'all' }))
    }
    dispatch(getCategories())
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

  shouldComponentUpdate(nextProps) {
    return shouldContainerUpdate(this.props, nextProps)
  }

  componentWillUnmount() {
    removeGlobalDrag()
  }

  render() {
    const { authentication, children, params, pagination, pathname } = this.props
    const { isLoggedIn } = authentication
    const appClasses = classNames(
      'AppContainer',
      { isLoggedIn },
      { isLoggedOut: !isLoggedIn },
    )
    return (
      <section className={appClasses}>
        <AppHelmet pagination={pagination} pathname={pathname} />
        <ViewportContainer routerParams={params} />
        {isLoggedIn ? <Omnibar /> : null}
        {children}
        <NavbarContainer routerParams={params} />
        <FooterContainer />
        {isLoggedIn ? <EditorToolsContainer /> : null}
        <Modal />
        <DevTools />
        <KeyboardContainer />
        <AnalyticsContainer />
      </section>
    )
  }
}

export default connect(mapStateToProps)(AppContainer)

