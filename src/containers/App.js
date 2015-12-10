import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { getClientCredentials } from '../actions/authentication'
import { loadProfile } from '../actions/profile'
import { trackPageView } from '../actions/tracking'
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
    super(props, context)
    this.lastLocation = ''
  }

  componentDidMount() {
    const { authentication, dispatch } = this.props
    if (authentication && authentication.isLoggedIn) {
      dispatch(loadProfile())
    } else {
      dispatch(getClientCredentials())
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
    const { location, children } = this.props
    const { pathname } = location
    return (
      <section className="App">
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
  if (state && state.authentication && state.authentication.isLoggedIn) {
    return store.dispatch(loadProfile())
  }
  return store.dispatch(getClientCredentials())
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
  }
}

export default connect(mapStateToProps)(App)

