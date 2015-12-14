import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { loadProfile } from '../actions/profile'
import { trackPageView } from '../actions/tracking'
import Analytics from '../components/analytics/Analytics'
import DevTools from '../components/devtools/DevTools'
import Modal from '../components/modals/Modal'
import Navbar from '../components/navbar/Navbar'

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
    lastLocation: '',
  }

  constructor(props, context) {
    super(props, context)
    this.lastLocation = ''
  }

  componentDidMount() {
    this.props.dispatch(loadProfile())
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
  return store.dispatch(loadProfile())
}

export default connect()(App)

