import React from 'react'
import { connect } from 'react-redux'
import Navbar from '../components/navigation/Navbar'
import Devtools from '../components/devtools/Devtools'

class App extends React.Component {

  render() {
    const { location } = this.props
    return (
      <section className="App">
        <main className="Main" data-pathname={location.pathname} role="main">
          {this.props.children}
        </main>
        <Navbar/>
        <Devtools/>
      </section>
    )
  }

}

export default connect()(App)

