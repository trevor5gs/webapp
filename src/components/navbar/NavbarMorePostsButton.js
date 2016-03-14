import React, { PropTypes } from 'react'
import { ArrowIcon } from '../navbar/NavbarIcons'

const NavbarMorePostsButton = ({ onClick }) =>
  <button onClick={ onClick } className="NavbarMorePostsButton">
    <ArrowIcon />
    <span>More Posts</span>
  </button>

NavbarMorePostsButton.propTypes = {
  onClick: PropTypes.func,
}

export default NavbarMorePostsButton

