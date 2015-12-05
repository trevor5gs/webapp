import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class NavbarLink extends Component {
  static propTypes = {
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    to: PropTypes.string.isRequired,
  }

  render() {
    const { to, label, icon, onClick } = this.props
    return (
      <Link activeClassName="active" to={to} onClick={onClick} className="NavbarLink">
        { icon }
        <span className="NavbarLinkLabel">{label}</span>
      </Link>
    )
  }
}

export default NavbarLink

