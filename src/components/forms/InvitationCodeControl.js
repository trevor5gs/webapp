import React, { Component } from 'react'
import FormControl from './FormControl'

/* eslint-disable react/prefer-stateless-function */
class InvitationCodeControl extends Component {

  static defaultProps = {
    className: 'InvitationCodeControl',
    id: 'invitationCode',
    name: 'user[invitation_code]',
    placeholder: 'Enter code',
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
      />
    )
  }
}

export default InvitationCodeControl
