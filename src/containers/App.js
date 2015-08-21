import React from 'react'
import Navbar from '../components/navigation/Navbar'

class App extends React.Component {
  render() {
    return (
      <section className="App">
        <main role="main">
          {this.props.children}
        </main>
        <Navbar/>
      </section>
    )
  }
}

export default App

