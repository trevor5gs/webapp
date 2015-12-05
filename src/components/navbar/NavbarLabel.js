import React, { Component, PropTypes } from 'react'

class NavbarLabel extends Component {
  static propTypes = {
    avatar: PropTypes.object,
    username: PropTypes.string,
  }

  render() {
    return (
      <h2 className="NavbarLabel">Ello</h2>
    )
  }
}

export default NavbarLabel

