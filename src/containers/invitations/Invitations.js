import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadInvitedUsers } from '../../actions/invitations'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../../components/views/MainView'
import InvitationFormContainer from '../InvitationFormContainer'

class Invitations extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  static preRender = (store) =>
    store.dispatch(loadInvitedUsers())

  render() {
    return (
      <MainView className="Invitations">
        <header className="InvitationsHeader">
          <h1 className="InvitationsHeading">Invite some cool people</h1>
          <p>
            Help Ello grow.
          </p>
        </header>
        <InvitationFormContainer />
        <h2 className="InvitationsStreamHeading">People you've invited</h2>
        <StreamContainer action={loadInvitedUsers()} />
      </MainView>
    )
  }
}

export default connect()(Invitations)

