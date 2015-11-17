import React from 'react'

class NavbarLabel extends React.Component {

  render() {
    return (
      <h2 className="NavbarLabel">Ello</h2>
    )
  }
}

NavbarLabel.propTypes = {
  avatar: React.PropTypes.object,
  username: React.PropTypes.string,
}

export default NavbarLabel

