import React, { PropTypes } from 'react'
import { MainView } from '../views/MainView'
import StreamContainer from '../../containers/StreamContainer'
import InvitationFormContainer from '../../containers/InvitationFormContainer'

export const Invitations = ({ streamAction }) =>
  <MainView className="Invitations">
    <header className="InvitationsHeader">
      <h1 className="InvitationsHeading">Invite some cool people</h1>
      <p>Help Ello grow.</p>
    </header>
    <InvitationFormContainer />
    <h2 className="InvitationsStreamHeading">{'People you\'ve invited'}</h2>
    <StreamContainer action={streamAction} />
  </MainView>

Invitations.propTypes = {
  streamAction: PropTypes.object.isRequired,
}

export default Invitations

