import React, { Component } from 'react'
import FormControl from './FormControl'

/* eslint-disable react/prefer-stateless-function */
class PasswordControl extends Component {

  static defaultProps = {
    className: 'PasswordControl',
    id: 'password',
    label: 'Password',
    name: 'user[password]',
    placeholder: 'Enter your password',
  }

  clear() {
    if (this.refs.Control.clear) {
      this.refs.Control.clear()
    }
  }

  render() {
    return (
      <FormControl
        { ...this.props }
        autoCapitalize="off"
        autoCorrect="off"
        type="password"
        ref="Control"
      />
    )
  }
}

export default PasswordControl

