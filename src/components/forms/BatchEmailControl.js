import React, { Component } from 'react'
import FormControl from './FormControl'

class BatchEmailControl extends Component {

  render() {
    return (
      <FormControl
        { ...this.props }
        autoCapitalize="off"
        autoCorrect="off"
        type="text"
      />
    )
  }
}

BatchEmailControl.defaultProps = {
  className: 'BatchEmailControl',
  id: 'emails',
  label: 'Emails',
  name: 'invitations[email]',
  placeholder: 'Enter email addresses',
}

export default BatchEmailControl

