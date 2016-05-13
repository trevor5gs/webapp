import React, { PropTypes } from 'react'

const ShareProfileButton = ({ children, onClick }) =>
  <button
    className="ShareProfileButton"
    onClick={onClick}
  >
    {children}
  </button>

ShareProfileButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default ShareProfileButton

