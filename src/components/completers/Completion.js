import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export default class Completion extends Component {

  static propTypes = {
    asset: PropTypes.shape({}),
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  getValue() {
    const { label, value } = this.props
    return value || label
  }

  handleClick = (e) => {
    const { onClick } = this.props
    onClick({ value: this.getValue(), e })
  };

  render() {
    const { asset, label, className } = this.props
    return (
      <button
        className={ classNames('Completion', className) }
        onClick={ this.handleClick }
      >
        { asset }
        <span className="CompletionLabel">{ label }</span>
      </button>
    )
  }
}

