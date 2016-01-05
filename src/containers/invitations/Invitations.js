import React, { Component } from 'react'
import { loadInvitedUsers } from '../../actions/invitations'
import StreamComponent from '../../components/streams/StreamComponent'
import InvitationForm from '../../components/forms/InvitationForm'

class Invitations extends Component {
  render() {
    return (
      <section className="Invitations Panel">
        <header className="InvitationsHeader">
          <h1 className="InvitationsHeading">Invite your friends</h1>
          <p>Help Ello grow organically by inviting the people you love, and who you know will love Ello too.</p>
        </header>
        <div className="InvitationsForm">
          <InvitationForm/>
        </div>
        <h2 className="InvitationsStreamHeading">Friends you've invited</h2>
        <StreamComponent action={loadInvitedUsers()} />
      </section>
    )
  }
}

Invitations.preRender = (store) => {
  return store.dispatch(loadInvitedUsers())
}

export default Invitations

