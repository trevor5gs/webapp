import React, { Component } from 'react'
import FormControl from './FormControl'

/* eslint-disable react/prefer-stateless-function */
class BatchEmailControl extends Component {

  static defaultProps = {
    className: 'BatchEmailControl',
    id: 'emails',
    label: 'Emails',
    name: 'invitations[email]',
    placeholder: 'Enter email addresses',
  }

  clear() {
    if (this.control.clear) {
      this.control.clear()
    }
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
        kind="textarea"
        type="text"
        ref={(comp) => { this.control = comp }}
      />
    )
  }
}

export default BatchEmailControl

