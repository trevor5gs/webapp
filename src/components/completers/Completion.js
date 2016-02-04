import React, { Component, PropTypes } from 'react'

export default class Completion extends Component {

  static propTypes = {
    asset: PropTypes.shape({}),
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  handleClick = (e) => {
    const { onClick, value } = this.props
    onClick({ value, e })
  };

  render() {
    const { asset, label } = this.props
    return (
      <button className="Completion" onClick={ this.handleClick }>
        { asset }
        <span className="CompletionLabel">{ label }</span>
      </button>
    )
  }
}

