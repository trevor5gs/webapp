import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'
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
          <Link className="NavbarProfileLink truncate" to={`/${username}`}>{`@${username}`}</Link>
          <Link className="NavbarProfileLink truncate" to={`/${username}/loves`}>Loves</Link>
          <Link className="NavbarProfileLink truncate" to="/invitations">Invite</Link>
          <Link className="NavbarProfileLink truncate" to="/settings">Settings</Link>
          <hr className="NavbarProfileLinkDivider" />
          <a
            className="NavbarProfileLink truncate"
            href={`${ENV.AUTH_DOMAIN}/wtf/resources/community-directory/`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Communities
          </a>
          <a
            className="NavbarProfileLink truncate"
            href={`${ENV.AUTH_DOMAIN}/wtf`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Help
          </a>
          <a
            className="NavbarProfileLink truncate"
            href={threadlessLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            Store
          </a>
          <button className="NavbarProfileLink truncate" onClick={onLogOut}>Logout</button>
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

export default NavbarProfile

