import React, { PropTypes } from 'react'
import { TabListLinks } from './TabList'
import { Link } from 'react-router'

export const CategoryTabBar = ({ pathname, tabs }) =>
  <div className="CategoryTabBar">
    <TabListLinks
      activePath={pathname}
      className="CategoryTabBarLinks"
      tabClasses="CategoryLabelTab"
      tabs={tabs}
    />
    <div className="CategoryTabBarUtility">
      <Link activeClassName="active" className="CategoryLabelTab" to="/discover/all">See All</Link>
    </div>
  </div>

CategoryTabBar.propTypes = {
  pathname: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
}

