import React from 'react'
import { Link } from 'react-router'
import Avatar from '../users/Avatar'


class NavbarProfile extends React.Component {

  render() {
    const { avatar, username} = this.props
    if (avatar && username) {
      return (
        <Link className="NavbarProfile" to={`/${username}`}>
          <Avatar imgSrc={avatar.regular.url} />
        </Link>
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

