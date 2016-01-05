import React from 'react'
import classNames from 'classnames'

export default function FooterLabel({ className, label }) {
  return (
    <span className={classNames(className, 'FooterLabel')}>
      { label }
    </span>
  )
}

