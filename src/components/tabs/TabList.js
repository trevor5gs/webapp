// TODO: There are only 3 of these at one time but still...
/* eslint-disable react/jsx-no-bind */
import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

function isActive(tab, activePath) {
  if (!tab.activePattern) {
    return tab.to === activePath
  }
  return tab.activePattern.test(activePath)
}

export const TabListLinks = ({ activePath, className, onTabClick, tabClasses, tabs }) =>
  <nav className={classNames(className, 'TabListLinks')} role="tablist">
    {tabs.map((tab, index) =>
      <Link
        className={classNames(tabClasses, 'TabLink', { active: isActive(tab, activePath) })}
        key={`TabLink-${tab.to.replace('/', '_')}_${index}`}
        onClick={onTabClick ? () => { onTabClick({ type: tab.type }) } : null}
        to={tab.to}
      >
        {tab.children}
      </Link>
    )}
  </nav>

TabListLinks.propTypes = {
  activePath: PropTypes.string,
  className: PropTypes.string,
  onTabClick: PropTypes.func,
  tabClasses: PropTypes.string,
  tabs: PropTypes.array.isRequired,
}

// -------------------------------------

export const TabListButtons = ({ activeType, className, onTabClick, tabClasses, tabs }) =>
  <nav className={classNames(className, 'TabListButtons')} role="tablist">
    {tabs.map((tab, index) =>
      <button
        className={classNames(tabClasses, 'TabButton', { active: tab.type === activeType })}
        key={`TabButton-${tab.type}_${index}`}
        onClick={() => { onTabClick({ type: tab.type }) }}
        type="button"
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

