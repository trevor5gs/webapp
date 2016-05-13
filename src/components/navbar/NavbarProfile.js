import React, { PropTypes } from 'react'
import Avatar from '../assets/Avatar'
import classNames from 'classnames'
import { Link } from 'react-router'
import { ExIcon } from './NavbarIcons'

const threadlessLink = 'http://ello.threadless.com/'

export const NavbarProfile = ({
  avatar,
  isProfileMenuActive,
  onClickAvatar,
  onLogOut,
  username,
}) => {
  if (avatar && username) {
    return (
      <span className="NavbarProfile">
        <Avatar sources={avatar} onClick={onClickAvatar} />
        <nav className={classNames('NavbarProfileLinks', { isActive: isProfileMenuActive })} >
          <Link className="NavbarProfileLink" to={`/${username}`}>{`@${username}`}</Link>
          <Link className="NavbarProfileLink" to={`/${username}/loves`}>Loves</Link>
          <Link className="NavbarProfileLink" to="/invitations">Invite</Link>
          <Link className="NavbarProfileLink" to="/settings">Settings</Link>
          <hr className="NavbarProfileLinkDivider" />
          <a
            className="NavbarProfileLink"
            href={`${ENV.AUTH_DOMAIN}/wtf/resources/community-directory/`}
            target="_blank"
          >
            Communities
          </a>
          <a
            className="NavbarProfileLink"
            href={`${ENV.AUTH_DOMAIN}/wtf`}
            target="_blank"
          >
            Help
          </a>
          <a className="NavbarProfileLink" href={threadlessLink} target="_blank">Store</a>
          <button className="NavbarProfileLink" onClick={onLogOut}>Logout</button>
          <button className="NavbarProfileCloseButton">
            <ExIcon />
          </button>
        </nav>
      </span>
    )
  }
  return (
    <span className="NavbarProfile">
      <Avatar />
    </span>
  )
}

NavbarProfile.propTypes = {
  avatar: PropTypes.shape({}),
  isProfileMenuActive: PropTypes.bool,
  onClickAvatar: PropTypes.func,
  onLogOut: PropTypes.func,
  username: PropTypes.string,
}

