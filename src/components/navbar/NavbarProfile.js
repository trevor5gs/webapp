import React from 'react'
import Avatar from '../assets/Avatar'


class NavbarProfile extends React.Component {

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
  avatar: React.PropTypes.object,
  username: React.PropTypes.string,
}

export default NavbarProfile

