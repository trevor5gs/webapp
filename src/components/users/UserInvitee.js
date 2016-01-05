import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import RelationsGroup from '../relationships/RelationsGroup'

class UserInvitee extends Component {
  static propTypes = {
    className: PropTypes.string,
    user: PropTypes.shape({}).isRequired,
  }

  renderMailtoUserHeader(user) {
    const { email } = user
    return (
      <div className="UserInviteeHeader">
        <a className="UserInviteeUserLink" href={`mailto: ${email}`}>
          <Avatar/>
          <span className="UserInviteeEmail">name@example.com</span>
        </a>
      </div>
    )
  }

  renderSending(user) {
    return (
      <div className={classNames(this.props.className, 'UserInvitee')}>
        { this.renderMailtoUserHeader(user) }
        <span className="UserInviteeStatusLabel">Sending</span>
      </div>
    )
  }

  renderPending(user) {
    return (
      <div className={classNames(this.props.className, 'UserInvitee')}>
        { this.renderMailtoUserHeader(user) }
        <span className="UserInviteeStatusLabel">Pending</span>
      </div>
    )
  }

  renderReInvite(user) {
    return (
      <div className={classNames(this.props.className, 'UserInvitee')}>
        { this.renderMailtoUserHeader(user) }
        <button className="UserInviteeAction">Re-Invite</button>
      </div>
    )
  }

  renderAccepted(user) {
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
    const { user } = this.props
    // return user.username ? this.renderAccepted(user) : this.renderPending(user)
    return user.username ? this.renderAccepted(user) : this.renderReInvite(user)
  }
}

export default UserInvitee

