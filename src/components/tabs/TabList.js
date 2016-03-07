import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

function isActive(tab, activePath) {
  if (!tab.activePattern) {
    return tab.to === activePath
  }
  return tab.activePattern.test(activePath)
}

export const TabListLinks = ({ activePath, className, tabClasses, tabs }) =>
  <nav className={classNames(className, 'TabListLinks')} role="tablist">
    {tabs.map((tab) =>
      <Link
        className={classNames(tabClasses, 'TabLink', { active: isActive(tab, activePath) })}
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

// -------------------------------------

// TODO: There are only 3 of these at one time but still...
/* eslint-disable react/jsx-no-bind */
export const TabListButtons = ({ activeType, className, onTabClick, tabClasses, tabs }) =>
  <nav className={classNames(className, 'TabListButtons')} role="tablist">
    {tabs.map((tab) =>
      <button
        className={classNames(tabClasses, 'TabButton', { active: tab.type === activeType })}
        key={`TabButton-${tab.type}`}
        onClick={() => { onTabClick({ type: tab.type }) }}
      >
        {tab.children}
      </button>
    )}
  </nav>

TabListButtons.propTypes = {
  activeType: PropTypes.string,
  className: PropTypes.string,
  onTabClick: PropTypes.func,
  tabClasses: PropTypes.string,
  tabs: PropTypes.array.isRequired,
}
