import React from 'react'
import Navbar from '../components/Navbar';

// This is the root of your application.
// React router will dynamically pass in this.props.children based on the route
export default class App {
  render() {
    return (
      <div className='app'>
        <nav className='navbar'>
          <Navbar />
        </nav>
        <div className='main' style={{marginTop: 30 + 'px'}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

