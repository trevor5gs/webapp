import React, { Component } from 'react'
import FormControl from './FormControl'

class EmailControl extends Component {

  render() {
    return (
      <FormControl
        { ...this.props }
        autoCapitalize="off"
        autoCorrect="off"
        type="email"
      />
    )
  }
}

EmailControl.defaultProps = {
  className: 'EmailControl',
  id: 'email',
  label: 'Email',
  name: 'user[name]',
  placeholder: 'Enter your email',
}


export default EmailControl

