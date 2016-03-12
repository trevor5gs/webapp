import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classNames from 'classnames'
import { inviteUsers } from '../../actions/invitations'
import Avatar from '../assets/Avatar'
import RelationsGroup from '../relationships/RelationsGroup'
import { getLinkObject } from '../base/json_helper'

class UserInvitee extends Component {

  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    invitation: PropTypes.shape({}).isRequired,
    json: PropTypes.object.isRequired,
  }

  onClickReInvite = () => {
    const { dispatch, invitation } = this.props
    const emails = [invitation.email]
    dispatch(inviteUsers(emails))
  }

  renderMailtoUserHeader(invitation) {
    const { email } = invitation
    return (
      <div className="UserInviteeHeader">
        <a className="UserInviteeUserLink" href={ `mailto: ${email}` }>
          <Avatar />
          <span className="UserInviteeEmail">{ email }</span>
        </a>
      </div>
    )
  }

  renderSending(invitation) {
    return (
      <div className={classNames(this.props.className, 'UserInvitee')}>
        { this.renderMailtoUserHeader(invitation) }
        <span className="UserInviteeStatusLabel">Sending</span>
      </div>
    )
  }

  renderReInvite(invitation) {
    return (
      <div className={classNames(this.props.className, 'UserInvitee')}>
        { this.renderMailtoUserHeader(invitation) }
        <button className="UserInviteeAction" onClick={ this.onClickReInvite }>Re-Invite</button>
      </div>
    )
  }

  renderAccepted(invitation) {
    const { json } = this.props
    const user = getLinkObject(invitation, 'acceptedBy', json)
    return (
      <div className={classNames(this.props.className, 'UserInvitee')}>
        <div className="UserInviteeHeader">
          <Link className="UserInviteeUserLink" to={`/${user.username}`}>
            <Avatar sources={user.avatar} />
            <span className="UserInviteeUsername">{`@${user.username}`}</span>
          </Link>
        </div>
        <RelationsGroup user={user} />
      </div>
    )
  }

  // Need to actually define when these states are setup
  render() {
    const { invitation } = this.props
    if (invitation.acceptedAt) {
      return this.renderAccepted(invitation)
    } else if (invitation.email) {
      return this.renderReInvite(invitation)
    }
    return null
  }
}

export default connect()(UserInvitee)

