import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { loadProfile } from '../actions/profile'
import { trackPageView } from '../actions/tracking'
import * as ACTION_TYPES from '../constants/action_types'
import Analytics from '../components/analytics/Analytics'
import DevTools from '../components/devtools/DevTools'
import Modal from '../components/modals/Modal'
import Navbar from '../components/navbar/Navbar'

class App extends Component {
  static propTypes = {
    authentication: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
  }

  static defaultProps = {
    lastLocation: '',
  }

  constructor(props, context) {
    const loggedOutPaths = {
      find: /^\/find/,
      root: /^\/explore/,
      recent: /^\/explore\/recent/,
      trending: /^\/explore\/trending/,
    }
    super(props, context)
    this.lastLocation = ''
    // need to clear out the authentication for the case of
    // when you are on ello.co and go to /onboarding (logging in)
    // then logging out of the mothership wouldn't clear out the
    // authentication here and would show you the wrong navbar
    // and the links would be wrong for user/post detail pages
    const { dispatch, location } = this.props
    let isLoggedOutPath = false
    for (const re in loggedOutPaths) {
      if (location.pathname.match(loggedOutPaths[re])) {
        isLoggedOutPath = true
        break
      }
    }
    if (isLoggedOutPath) {
      dispatch({ type: ACTION_TYPES.AUTHENTICATION.LOGOUT })
    }
  }

  componentDidMount() {
    const { authentication, dispatch, location } = this.props
    if (authentication && authentication.isLoggedIn && location.pathname !== '/') {
      dispatch(loadProfile())
    }
  }

  componentDidUpdate() {
    const { location, dispatch } = this.props
    if (location.pathname !== this.lastLocation) {
      this.lastLocation = location.pathname
      dispatch(trackPageView())
    }
  }

  render() {
    const { location, children, authentication } = this.props
    const { isLoggedIn } = authentication
    const { pathname } = location
    const appClasses = classNames(
      'App',
      { isLoggedIn: isLoggedIn },
      { isLoggedOut: !isLoggedIn },
    )
    return (
      <section className={appClasses}>
        <Helmet title="Be inspired." titleTemplate="Ello | %s" />
        <main className="Main" data-pathname={pathname} role="main">
          {children}
        </main>
        <Navbar/>
        <Modal/>
        <DevTools/>
        <Analytics/>
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

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
  }
}

export default connect(mapStateToProps)(App)

