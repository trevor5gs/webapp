import React, { PropTypes } from 'react'
import classNames from 'classnames'

const TabListButtons = ({ activeType, className, onTabClick, tabClasses, tabs }) => {
  return (
    <nav className={classNames(className, 'TabListButtons')} role="tablist">
      {tabs.map((tab) => {
        return (
          <button
            className={classNames(tabClasses, 'TabButton', { active: tab.type === activeType })}
            key={`TabButton-${tab.type}`}
            onClick={() => { onTabClick({ type: tab.type }) }}
            >
            {tab.children}
          </button>
          )
      })}
    </nav>
  )
}

TabListButtons.propTypes = {
  activeType: PropTypes.string,
  className: PropTypes.string,
  onTabClick: PropTypes.func,
  tabClasses: PropTypes.string,
  tabs: PropTypes.array.isRequired,
}

export default TabListButtons

