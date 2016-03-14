import React, { PropTypes } from 'react'
import classNames from 'classnames'

export default function FooterLabel({ className, label }) {
  return (
    <span className={ classNames(className, 'FooterLabel') }>
      { label }
    </span>
  )
}

FooterLabel.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
}

