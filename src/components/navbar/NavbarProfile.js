import React, { Component, PropTypes } from 'react'
import Avatar from '../assets/Avatar'

class NavbarProfile extends Component {

  render() {
    const { avatar, username } = this.props
    if (avatar && username) {
      return (
        <span className="NavbarProfile">
          <Avatar to={`/${username}`} sources={avatar} />
        </span>
      )
    }
    return (
      <span className="NavbarProfile">
        <Avatar/>
      </span>
    )
  }
}

NavbarProfile.propTypes = {
  avatar: PropTypes.object,
  username: PropTypes.string,
}

export default NavbarProfile

