import React from 'react'
import { Link } from 'react-router'


class NavbarLink extends React.Component {

  render() {
    const { to, label, icon } = this.props
    return (
      <Link activeClassName="active" to={to} className="NavbarLink">
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
}

export default NavbarLink

