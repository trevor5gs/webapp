import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

class NavbarLink extends Component {
  static propTypes = {
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    modifiers: PropTypes.string,
    onClick: PropTypes.func,
    pathname: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }

  static defaultProps = {
    modifiers: '',
  }

  static highlightingRules = {
    '/': /^\/$|^\/trending$|^\/recent$/,
  }

  render() {
    const { icon, label, modifiers, onClick, pathname, to } = this.props
    const klassNames = classNames(
      'NavbarLink',
      modifiers,
      { active: NavbarLink.highlightingRules[to] ? pathname.match(NavbarLink.highlightingRules[to]) : pathname.match(to) },
    )
    return (
      <Link to={to} onClick={onClick} className={klassNames}>
        { icon || null }
        <span className="NavbarLinkLabel">{label}</span>
      </Link>
    )
  }
}

export default NavbarLink

