import React, { Component } from 'react'
import FormControl from './FormControl'

class PasswordControl extends Component {

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

PasswordControl.defaultProps = {
  className: 'PasswordControl',
  id: 'password',
  label: 'Password',
  name: 'user[password]',
  placeholder: 'Enter your password',
}

export default PasswordControl

