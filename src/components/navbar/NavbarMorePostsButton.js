import React, { PropTypes } from 'react'
import { ArrowIcon } from '../navbar/NavbarIcons'

export const NavbarMorePostsButton = ({ onClick }) =>
  <button className="NavbarMorePostsButton" onClick={onClick} >
    <ArrowIcon />
    <span>New Posts</span>
  </button>

NavbarMorePostsButton.propTypes = {
  onClick: PropTypes.func,
}

export default NavbarMorePostsButton

