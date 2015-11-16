import React from 'react'
import { connect } from 'react-redux'
import Modal from '../components/modals/Modal'
import Navbar from '../components/navigation/Navbar'
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
    const { path, dispatch } = this.props
    if (path !== this.lastLocation) {
      this.lastLocation = path
      dispatch(trackPageView())
    }
  }

  render() {
    const { children, path } = this.props
    return (
      <section className="App">
        <main className="Main" data-pathname={path} role="main">
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
  path: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired,
}

App.preRender = (store) => {
  return store.dispatch(loadProfile())
}

export default connect()(App)

