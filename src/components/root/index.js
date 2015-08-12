import React from 'react'
import Navbar from '../Navbar';

// This is the root of your application.
// React router will dynamically pass in this.props.children based on the route
export default class Root {
  render() {
    return (
      <div className='root'>
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

