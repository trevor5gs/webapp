import React from 'react'
import { connect } from 'react-redux'
import Modal from '../components/modals/Modal'
import Navbar from '../components/navigation/Navbar'
import DevGrid from '../components/devtools/DevGrid'
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
        <DevGrid/>
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

export default connect()(App)

