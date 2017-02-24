import React, { PureComponent } from 'react'
import FormControl from './FormControl'

class InvitationCodeControl extends PureComponent {
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

