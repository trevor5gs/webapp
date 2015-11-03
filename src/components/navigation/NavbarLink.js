import React from 'react'
import { Link } from 'react-router'
import { BoltIcon, CircleIcon, SearchIcon, SparklesIcon, StarIcon } from '../iconography/Icons'


class NavbarLink extends React.Component {

  renderIcon(icon) {
    switch (icon) {
    case 'BoltIcon':
      return <BoltIcon />
    case 'SearchIcon':
      return <SearchIcon />
    case 'SparklesIcon':
      return <SparklesIcon />
    case 'StarIcon':
      return <StarIcon />
    case 'CircleIcon':
    default:
      return <CircleIcon />
    }
  }

  render() {
    const { to, label, icon } = this.props
    return (
      <Link to={to} className="NavbarLink">
        { this.renderIcon(icon) }
        <span className="NavbarLinkLabel">{label}</span>
      </Link>
    )
  }
}

NavbarLink.propTypes = {
  to: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired,
}

export default NavbarLink

