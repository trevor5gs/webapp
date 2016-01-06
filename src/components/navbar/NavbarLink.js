import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

const highlightingRules = {
  '/': /^\/$|^\/trending$|^\/recent$/,
}

class NavbarLink extends Component {

  render() {
    const { icon, label, modifiers, onClick, pathname, to } = this.props
    const klassNames = classNames(
      'NavbarLink',
      modifiers,
      {
        active: highlightingRules[to] ?
          pathname.match(NavbarLink.highlightingRules[to]) :
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

NavbarLink.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  modifiers: PropTypes.string,
  onClick: PropTypes.func,
  pathname: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

NavbarLink.defaultProps = {
  modifiers: '',
}

export default NavbarLink

