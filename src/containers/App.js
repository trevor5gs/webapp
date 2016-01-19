import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { loadProfile } from '../actions/profile'
import { trackPageView } from '../actions/tracking'
import * as ACTION_TYPES from '../constants/action_types'
import Analytics from '../components/analytics/Analytics'
import DevTools from '../components/devtools/DevTools'
import Footer from '../components/footer/Footer'
import Modal from '../components/modals/Modal'
import Navbar from '../components/navbar/Navbar'

class App extends Component {

  constructor(props, context) {
    const loggedOutPaths = {
      explore: /^\/explore/,
      explore_recent: /^\/explore\/recent/,
      explore_trending: /^\/explore\/trending/,
      find: /^\/find$/,
      forgot_password: /^\/forgot-password/,
      signup: /^\/signup/,
    }
    super(props, context)
    this.lastLocation = ''
    // need to clear out the authentication for the case of
    // when you are on ello.co and go to /onboarding (logging in)
    // then logging out of the mothership wouldn't clear out the
    // authentication here and would show you the wrong navbar
    // and the links would be wrong for user/post detail pages
    const { dispatch, pathname } = this.props
    let isLoggedOutPath = false
    for (const re in loggedOutPaths) {
      if (pathname.match(loggedOutPaths[re])) {
        isLoggedOutPath = true
        break
      }
    }
    if (isLoggedOutPath) {
      dispatch({ type: ACTION_TYPES.AUTHENTICATION.LOGOUT })
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevAuthentication = this.props.authentication
    const { authentication, dispatch, location } = nextProps
    if (authentication &&
        !prevAuthentication.isLoggedIn &&
        authentication.isLoggedIn &&
        location.pathname !== '/') {
      dispatch(loadProfile())
    }
  }

  componentDidUpdate() {
    const { pathname, dispatch } = this.props
    if (pathname !== this.lastLocation) {
      this.lastLocation = pathname
      dispatch(trackPageView())
    }
  }

  render() {
    const { pathname, children, authentication } = this.props
    const { isLoggedIn } = authentication
    const appClasses = classNames(
      'App',
      { isLoggedIn },
      { isLoggedOut: !isLoggedIn },
    )
    return (
      <section className={appClasses}>
        <Helmet title="Be inspired." titleTemplate="Ello | %s" />
        <main className="Main" data-pathname={pathname} role="main">
          {children}
        </main>
        <Navbar/>
        <Footer/>
        <Modal/>
        <DevTools/>
        <Analytics isLoggedIn={isLoggedIn}/>
      </section>
    )
  }
}

App.preRender = (store) => {
  const state = store.getState()
  if (state.authentication && state.authentication.isLoggedIn) {
    return store.dispatch(loadProfile())
  }
}

App.propTypes = {
  authentication: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
}

App.defaultProps = {
  lastLocation: '',
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    pathname: state.router.path,
  }
}

export default connect(mapStateToProps)(App)

