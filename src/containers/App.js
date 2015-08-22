import React from 'react'
import Navbar from '../components/navigation/Navbar'

class App extends React.Component {
  render() {
    const { location } = this.props
    return (
      <section className="App">
        <main className="Main" data-pathname={location.pathname} role="main">
          {this.props.children}
        </main>
        <Navbar/>
      </section>
    )
  }
}

export default App

