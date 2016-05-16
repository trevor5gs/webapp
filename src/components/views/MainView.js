import React, { PropTypes } from 'react'
import classNames from 'classnames'

export const MainView = ({ children, className }) =>
  <main className={classNames(className, 'MainView')} role="main">
    {children}
  </main>

MainView.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
}

