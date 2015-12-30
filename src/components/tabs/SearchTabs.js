import React, { PropTypes } from 'react'
import classNames from 'classnames'

const SearchTabs = ({ onTabClick, tabs, type }) => {
  return (
    <nav className="SearchTabs" role="tablist">
      {tabs.map((tab) => {
        return (
          <button
            className={classNames('TextTab SearchTab', { active: tab.type === type })}
            key={`SearchTab-${tab.type}`}
            onClick={() => { onTabClick({ type: tab.type }) }}
            >
            {tab.children}
          </button>
          )
      })}
    </nav>
  )
}

SearchTabs.propTypes = {
  onTabClick: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
  type: PropTypes.string,
}

export default SearchTabs

