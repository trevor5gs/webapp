import React, { PropTypes } from 'react'
import classNames from 'classnames'

// -------------------------------------

export const FooterLabel = ({ className, label }) =>
  <span className={classNames(className, 'FooterLabel')}>
    {label}
  </span>

FooterLabel.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
}

// -----------------

// This is alway an external link.
export const FooterLink = ({ className, href, icon, label }) =>
  <a
    className={classNames(className, 'FooterLink')}
    href={href}
    rel="noopener noreferrer"
    target="_blank"
  >
    {icon}
    <span>{label}</span>
  </a>

FooterLink.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.string,
}

// -----------------

export const FooterTool = ({ className, icon, label, onClick }) =>
  <button className={classNames(className, 'FooterTool')} onClick={onClick} >
    {icon}
    <span>{label}</span>
  </button>

FooterTool.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.string,
  onClick: PropTypes.func,
}

