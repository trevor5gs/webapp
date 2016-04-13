import React, { Component } from 'react'
import FormControl from './FormControl'

/* eslint-disable react/prefer-stateless-function */
class EmailControl extends Component {

  static defaultProps = {
    className: 'EmailControl',
    id: 'email',
    name: 'user[email]',
    placeholder: 'Enter your email',
  }

  render() {
    return (
      <FormControl
        { ...this.props }
        autoCapitalize="off"
        autoCorrect="off"
        type="email"
        ref
      />
    )
  }
}

export default EmailControl

