import React, { PropTypes } from 'react'
import classNames from 'classnames'

export const FooterLabel = ({ className, label }) =>
  <span className={classNames(className, 'FooterLabel')}>
    {label}
  </span>

FooterLabel.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
}

