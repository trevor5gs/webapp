import React, { Component, PropTypes } from 'react'
import Avatar from '../assets/Avatar'
import { Link } from 'react-router'

const appleStoreLink = 'http://appstore.com/ello/ello'
const threadlessLink = 'http://ello.threadless.com/'

class NavbarProfile extends Component {
  render() {
    const { avatar, username } = this.props
    if (avatar && username) {
      return (
        <span className="NavbarProfile">
          <Avatar to={`/${username}`} sources={avatar} />
          <nav className="NavbarProfileLinks">
            <Link className="NavbarProfileLink" to={`/${username}`}>{`@${username}`}</Link>
            <Link className="NavbarProfileLink" to={`/${username}/loves`}>Loves</Link>
            <Link className="NavbarProfileLink" to="/invitations">Invite</Link>
            <Link className="NavbarProfileLink" to="/settings">Settings</Link>
            <hr className="NavbarProfileLinkDivider"/>
            <Link className="NavbarProfileLink" to="/discover/communities">Communities</Link>
            <a className="NavbarProfileLink" href="/wtf" target="_blank">Help</a>
            <a className="NavbarProfileLink" href={appleStoreLink} target="_blank">Get the app</a>
            <a className="NavbarProfileLink" href={threadlessLink} target="_blank">Store</a>
            <a className="NavbarProfileLink" href="/logout" rel="nofollow">Logout</a>
          </nav>

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

