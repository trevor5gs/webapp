import React, { PropTypes } from 'react'
import { PencilIcon } from '../navbar/NavbarIcons'

export const NavbarOmniButton = ({ onClick, onDragOver }) =>
  <button className="NavbarOmniButton" onClick={onClick} onDragOver={onDragOver}>
    <PencilIcon />
    <span>Post</span>
  </button>

NavbarOmniButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
}

