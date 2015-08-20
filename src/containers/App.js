import React from 'react'
import Navbar from '../components/navigation/Navbar'

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Navbar/>
        <main>
          {this.props.children}
        </main>
      </div>
    )
  }
}

export default App

