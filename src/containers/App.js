import React from 'react'
import Navbar from '../components/Navbar'

class App extends React.Component {
  render() {
    return (
      <div className='app'>
        <Navbar/>
        <main>
          {this.props.children}
        </main>
      </div>
    )
  }
}

export default App
