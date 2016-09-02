import React, { Component } from 'react'
import { loadInvitedUsers } from '../actions/invitations'
import { Invitations } from '../components/views/Invitations'

class InvitationsContainer extends Component {

  static preRender = (store) =>
    store.dispatch(loadInvitedUsers())

  render() {
    return <Invitations streamAction={loadInvitedUsers()} />
  }
}

export default InvitationsContainer

