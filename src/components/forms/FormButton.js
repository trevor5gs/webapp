import React, { Component, PropTypes } from 'react'

class FormButton extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <button className="FormButton">
        { this.props.children }
      </button>
    )
  }
}

export default FormButton

