import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

const TabListLinks = ({ activePath, className, tabClasses, tabs }) =>
  <nav className={classNames(className, 'TabListLinks')} role="tablist">
    {tabs.map((tab) =>
      <Link
        className={classNames(tabClasses, 'TabLink', { active: tab.to === activePath })}
        key={`TabLink-${tab.to.replace('/', '_')}`}
        to={tab.to}
      >
        {tab.children}
      </Link>
    )}
  </nav>


TabListLinks.propTypes = {
  activePath: PropTypes.string,
  className: PropTypes.string,
  tabClasses: PropTypes.string,
  tabs: PropTypes.array.isRequired,
}

export default TabListLinks

