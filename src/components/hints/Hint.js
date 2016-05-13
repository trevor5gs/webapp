import React, { PropTypes } from 'react'
import classNames from 'classnames'

const Hint = ({ className, children }) =>
  <span className={classNames('Hint', className)}>{children}</span>

Hint.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
}

export default Hint

