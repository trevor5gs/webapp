import React, { Component } from 'react'
import FormControl from './FormControl'

/* eslint-disable react/prefer-stateless-function */
class TextControl extends Component {

  static defaultProps = {
    className: 'TextControl',
    id: 'textControl',
    name: 'text',
    placeholder: 'Text',
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
        ref="textControl"
        type="text"
      />
    )
  }
}

export default TextControl

