import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

const highlightingRules = {
  '/': /^\/$|^\/discover\/trending$|^\/discover\/recent$/,
  '/following': /^\/following/,
}

export const NavbarLink = ({
    className = '',
    icon,
    label,
    onClick,
    onDragLeave,
    onDragOver,
    onDrop,
    pathname,
    to,
  }) => {
  const klassNames = classNames(
    'NavbarLink',
    className,
    {
      isActive: highlightingRules[to] ? pathname.match(highlightingRules[to]) : pathname.match(to),
    },
  )
  return (
    <Link
      className={klassNames}
      onClick={onClick}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      to={to}
    >
      {icon || null}
      <span className="NavbarLinkLabel">{label}</span>
    </Link>
  )
}

NavbarLink.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  pathname: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

export default NavbarLink

