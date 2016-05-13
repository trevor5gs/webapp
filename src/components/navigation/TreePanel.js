import React, { PropTypes } from 'react'
import classNames from 'classnames'

const TreePanel = ({ className, children }) =>
  <div className={classNames(className, 'TreePanel')}>
    {children}
  </div>

TreePanel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default TreePanel

