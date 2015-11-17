import React from 'react'
import { connect } from 'react-redux'
import Modal from '../components/modals/Modal'
import Navbar from '../components/navbar/Navbar'
import DevTools from '../components/devtools/DevTools'
import Analytics from '../components/analytics/Analytics'
import { trackPageView } from '../actions/tracking'
import { loadProfile } from '../actions/profile'

class App extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.lastLocation = ''
  }

  componentWillMount() {
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

App.defaultProps = {
  lastLocation: '',
}

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }),
  children: React.PropTypes.node.isRequired,
}

App.preRender = (store) => {
  return store.dispatch(loadProfile())
}

export default connect()(App)
