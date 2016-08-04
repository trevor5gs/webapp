import React, { PropTypes } from 'react'

export const MiniPillButton = ({ children, onClick }) =>
  <button
    className="MiniPillButton"
    onClick={onClick}
  >
    {children}
  </button>

MiniPillButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
}

