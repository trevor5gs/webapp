import React, { PropTypes } from 'react'
import { PencilIcon } from '../navbar/NavbarIcons'

const NavbarOmniButton = ({ callback }) =>
  <button className="NavbarOmniButton" onClick={callback}>
    <PencilIcon />
    <span>Post</span>
  </button>

NavbarOmniButton.propTypes = {
  callback: PropTypes.func.isRequired,
}

export default NavbarOmniButton

