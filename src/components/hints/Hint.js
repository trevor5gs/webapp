import React, { PropTypes } from 'react'

const Hint = ({ children }) =>
  <span className="Hint">{children}</span>

Hint.propTypes = {
  children: PropTypes.string,
}

export default Hint

