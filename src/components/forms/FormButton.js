import React, { PropTypes } from 'react'

const FormButton = ({ children, ...rest }) =>
  <button className="FormButton" {...rest}>
    {children}
  </button>

FormButton.propTypes = {
  children: PropTypes.node.isRequired,
}

export default FormButton

