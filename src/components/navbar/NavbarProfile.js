import React, { Component, PropTypes } from 'react'
import Avatar from '../assets/Avatar'
import { Link } from 'react-router'

const appleStoreLink = 'http://appstore.com/ello/ello'
const threadlessLink = 'http://ello.threadless.com/'

class NavbarProfile extends Component {
  static propTypes = {
    avatar: PropTypes.object,
    onLogOut: PropTypes.func,
    username: PropTypes.string,
  };

  render() {
    const { avatar, username, onLogOut } = this.props
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
            <a className="NavbarProfileLink" href="https://ello.co/wtf/resources/community-directory/" target="_blank">Communities</a>
            <a className="NavbarProfileLink" href="/wtf" target="_blank">Help</a>
            <a className="NavbarProfileLink" href={ threadlessLink } target="_blank">Store</a>
            <button className="NavbarProfileLink" onClick={ onLogOut }>Logout</button>
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

export default NavbarProfile

