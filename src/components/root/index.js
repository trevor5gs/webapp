import React from 'react'

// This is the root of your application.
// React router will dynamically pass in this.props.children based on the route
export default class Root {
  render() {
    return (
      <div className='root'>
        <div className='main'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

