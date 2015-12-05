import React, { Component, PropTypes } from 'react'

class Hint extends Component {
  static propTypes = {
    children: PropTypes.string,
  }

  render() {
    return (
      <span className="Hint">{this.props.children}</span>
    )
  }
}

export default Hint

