import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { TabListLinks } from './TabList'

export const CategoryTabBar = ({ pathname, tabs }) =>
  <div className="CategoryTabBar">
    <TabListLinks
      activePath={pathname}
      className="CategoryTabBarLinks"
      tabClasses="CategoryLabelTab"
      tabs={tabs}
    />
    <div className="CategoryTabBarUtility">
      <Link
        activeClassName="isActive"
        className="CategoryLabelTab"
        to="/discover/all"
      >
        See All
      </Link>
    </div>
  </div>

CategoryTabBar.propTypes = {
  pathname: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
}

export default CategoryTabBar

