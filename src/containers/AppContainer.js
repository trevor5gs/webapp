import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { getCategories } from '../actions/discover'
import { loadNotifications } from '../actions/notifications'
import { loadProfile } from '../actions/profile'
import * as MAPPING_TYPES from '../constants/mapping_types'
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
import { findModel } from '../helpers/json_helper'

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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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

AppContainer.preRender = (store) => {
  const state = store.getState()
  if (state.authentication && state.authentication.isLoggedIn) {
    store.dispatch(loadProfile())
  }
}

const PAGING_BLACKLIST = [
  /^\/enter\b/,
  /^\/forgot-password\b/,
  /^\/join\b/,
  /^\/signup\b/,
  /^\/following$/,
  /^\/starred$/,
  /^\/notifications\b/,
  /^\/settings\b/,
  /^\/onboarding\b/,
  /^\/invitations\b/,
]

function isPagingEnabled(pathname) {
  for (const re of PAGING_BLACKLIST) {
    if (re.test(pathname)) {
      return false
    }
  }
  return true
}

function mapStateToProps(state, ownProps) {
  const { authentication, json } = state
  let pagination = null
  if (state.json.pages && isPagingEnabled(ownProps.location.pathname)) {
    let result = state.json.pages[ownProps.location.pathname]
    if (!result && ownProps.params.token) {
      // determine if we are on a post detail
      // to find the comment pagination
      const post = findModel(json, {
        collection: MAPPING_TYPES.POSTS,
        findObj: { token: ownProps.params.token.toLowerCase() },
      })
      if (post) {
        result = state.json.pages[`/posts/${post.id}/comments`]
      }
    }
    if (result && result.pagination) {
      pagination = result.pagination
    }
  }
  return {
    authentication,
    pagination,
    pathname: ownProps.location.pathname,
  }
}

export default connect(mapStateToProps)(AppContainer)

