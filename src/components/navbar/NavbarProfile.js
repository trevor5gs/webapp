import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Avatar from '../assets/Avatar'
import classNames from 'classnames'
import { Link } from 'react-router'
import { ExIcon } from './NavbarIcons'

const threadlessLink = 'http://ello.threadless.com/'

class NavbarProfile extends Component {
  static propTypes = {
    avatar: PropTypes.object,
    onLogOut: PropTypes.func,
    username: PropTypes.string,
  };

  componentWillMount() {
    this.state = {
      isMenuOpen: false,
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickDocument)
  }

  onClickAvatar = () => {
    const { isMenuOpen } = this.state
    if (isMenuOpen) { return this.hideMenu() }
    return this.showMenu()
  };

  onClickDocument = () => {
    this.hideMenu()
  };

  showMenu() {
    if (this.state.isMenuOpen) { return }
    ReactDOM.findDOMNode(document.body).classList.add('profileMenuIsActive')
    document.addEventListener('click', this.onClickDocument)
    this.setState({ isMenuOpen: true })
  }

  hideMenu() {
    if (!this.state.isMenuOpen) { return }
    ReactDOM.findDOMNode(document.body).classList.remove('profileMenuIsActive')
    document.removeEventListener('click', this.onClickDocument)
    this.setState({ isMenuOpen: false })
  }

  render() {
    const { avatar, username, onLogOut } = this.props
    const { isMenuOpen } = this.state
    if (avatar && username) {
      return (
        <span className="NavbarProfile">
          <Avatar sources={avatar} onClick={ this.onClickAvatar } />
          <nav className={ classNames('NavbarProfileLinks', { active: isMenuOpen })}>
            <Link className="NavbarProfileLink" to={`/${username}`}>{`@${username}`}</Link>
            <Link className="NavbarProfileLink" to={`/${username}/loves`}>Loves</Link>
            <Link className="NavbarProfileLink" to="/invitations">Invite</Link>
            <Link className="NavbarProfileLink" to="/settings">Settings</Link>
            <hr className="NavbarProfileLinkDivider" />
            <a className="NavbarProfileLink" href="https://ello.co/wtf/resources/community-directory/" target="_blank">Communities</a>
            <a className="NavbarProfileLink" href="/wtf" target="_blank">Help</a>
            <a className="NavbarProfileLink" href={ threadlessLink } target="_blank">Store</a>
            <button className="NavbarProfileLink" onClick={ onLogOut }>Logout</button>
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
}

export default NavbarProfile

