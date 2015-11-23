import React from 'react'
import { Link } from 'react-router'


class NavbarLink extends React.Component {

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

NavbarLink.propTypes = {
  to: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  icon: React.PropTypes.element.isRequired,
  onClick: React.PropTypes.func,
}

export default NavbarLink

