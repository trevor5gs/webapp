import React, { PropTypes } from 'react'
import classNames from 'classnames'

// This is alway an external link.
export const FooterLink = ({ className, href, icon, label }) =>
  <a className={ classNames(className, 'FooterLink') } href={ href } target="_blank">
    { icon }
    <span>{ label }</span>
  </a>

FooterLink.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.string,
}

