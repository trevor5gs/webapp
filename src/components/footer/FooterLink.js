import React from 'react'
import classNames from 'classnames'

// This is alway an external link.
export default function FooterLink({ className, href, icon, label }) {
  return (
    <a className={classNames(className, 'FooterLink')} href={href} target="_blank">
      { icon }
      <span>{ label }</span>
    </a>
  )
}

