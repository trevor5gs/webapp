import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

const highlightingRules = {
  '/': /^\/$|^\/trending$|^\/recent$/,
  '/following': /^\/following/,
}

const NavbarLink = ({
    icon,
    label,
    modifiers = '',
    onClick,
    onDragLeave,
    onDragOver,
    onDrop,
    pathname,
    to,
  }) => {
  const klassNames = classNames(
    'NavbarLink',
    modifiers,
    {
      active: highlightingRules[to] ? pathname.match(highlightingRules[to]) : pathname.match(to),
    },
  )
  return (
    <Link
      className={ klassNames }
      onClick={ onClick }
      onDragLeave={ onDragLeave }
      onDragOver={ onDragOver }
      onDrop={ onDrop }
      to={ to }
    >
      { icon || null }
      <span className="NavbarLinkLabel">{ label }</span>
    </Link>
  )
}

NavbarLink.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  modifiers: PropTypes.string,
  onClick: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  pathname: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

export default NavbarLink

