import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

const PageTabs = ({ tabs, pathname }) => {
  return (
    <nav className="PageTabs" role="tablist">
      {tabs.map((tab) => {
        return (
          <Link
            className={classNames('TextTab PageTab', { active: tab.to === pathname })}
            key={`PageTab-${tab.to.replace('/', '_')}`}
            to={tab.to}
            >
            {tab.children}
          </Link>
          )
      })}
    </nav>
  )
}

PageTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  pathname: PropTypes.string,
}

export default PageTabs

