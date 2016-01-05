import React, { PropTypes } from 'react'
import { ArrowIcon } from '../navbar/NavbarIcons'

const NavbarMorePostsButton = ({ callback }) =>
  <button onClick={callback} className="NavbarMorePostsButton">
    <ArrowIcon/>
    <span>More Posts</span>
  </button>

NavbarMorePostsButton.propTypes = {
  callback: PropTypes.func,
}

export default NavbarMorePostsButton

