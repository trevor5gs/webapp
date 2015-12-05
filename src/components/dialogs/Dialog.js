import React, { Component, PropTypes } from 'react'

class Dialog extends Component {
  static propTypes = {
    body: PropTypes.string,
    title: PropTypes.string,
  }

  render() {
    return (
      <div className="Dialog">
        <h2>{this.props.title}</h2>
        <p>{this.props.body}</p>
      </div>
    )
  }
}

export default Dialog

