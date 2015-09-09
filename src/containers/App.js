import React from 'react'
import { connect } from 'react-redux'
import Navbar from '../components/navigation/Navbar'
import Modal from '../components/modals/Modal'
import Devtools from '../components/devtools/Devtools'

// Just testing these
import { openAlert } from '../actions/modals'
import AssetErrorDialog from '../components/dialogs/AssetErrorDialog'

class App extends React.Component {

  componentDidMount() {
    // -------------------------------------
    // Testing keys also remove from unmounting
    Mousetrap.bind('g a', () => {
      return this.props.dispatch(openAlert(<AssetErrorDialog assetType="Avatar" />))
    })
    Mousetrap.bind('g c', () => {
      return this.props.dispatch(openAlert(<AssetErrorDialog assetType="Cover" />))
    })
    // -------------------------------------
  }

  componentWillUnmount() {
    Mousetrap.unbind('g a')
    Mousetrap.unbind('g c')
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
        <Devtools/>
      </section>
    )
  }
}

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }),
  children: React.PropTypes.node.isRequired,
}

export default connect()(App)

