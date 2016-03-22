import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { getSelectionContainerElement } from '../editor/SelectionUtil'

/* eslint-disable react/prefer-stateless-function */
export default class Completion extends Component {

  static propTypes = {
    asset: PropTypes.shape({}),
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  onClickCompletion = (e) => {
    const { onClick } = this.props
    const node = getSelectionContainerElement()
    onClick({ value: this.getValue(), e })
    node.focus()
  }

  getValue() {
    const { label, value } = this.props
    return value || label
  }

  render() {
    const { asset, label, className } = this.props
    return (
      <button
        className={ classNames('Completion', className) }
        onClick={ this.onClickCompletion }
      >
        { asset }
        <span className="CompletionLabel">{ label }</span>
      </button>
    )
  }
}

