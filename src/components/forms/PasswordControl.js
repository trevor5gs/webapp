import React, { Component } from 'react'
import FormControl from './FormControl'

class PasswordControl extends Component {

  static defaultProps = {
    className: 'PasswordControl',
    id: 'password',
    label: 'Password',
    name: 'user[password]',
    placeholder: 'Enter your password',
  }

  render() {
    return (
      <FormControl
        { ...this.props }
        autoCapitalize="off"
        autoCorrect="off"
        type="password"
      />
    )
  }
}

export default PasswordControl

