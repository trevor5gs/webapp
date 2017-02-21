import React, { PureComponent } from 'react'
import { loadInvitedUsers } from '../actions/invitations'
import { Invitations } from '../components/views/Invitations'

class InvitationsContainer extends PureComponent {

  static preRender = store =>
    store.dispatch(loadInvitedUsers())

  render() {
    return <Invitations streamAction={loadInvitedUsers()} />
  }
}

export default InvitationsContainer

