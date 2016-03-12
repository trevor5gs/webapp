import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

const highlightingRules = {
  '/': /^\/$|^\/trending$|^\/recent$/,
  '/following': /^\/following/,
}

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

  render() {
    const { icon, label, modifiers, onClick, pathname, to } = this.props
    const klassNames = classNames(
      'NavbarLink',
      modifiers,
      {
        active: highlightingRules[to] ?
          pathname.match(highlightingRules[to]) :
          pathname.match(to),
      },
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

