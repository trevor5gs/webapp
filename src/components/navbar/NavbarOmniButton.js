import React, { PropTypes } from 'react'
import { PencilIcon } from '../navbar/NavbarIcons'

const NavbarOmniButton = ({ onClick }) =>
  <button className="NavbarOmniButton" onClick={onClick}>
    <PencilIcon />
    <span>Post</span>
  </button>

NavbarOmniButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default NavbarOmniButton

