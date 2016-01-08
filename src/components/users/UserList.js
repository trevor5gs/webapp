import React, { Component, PropTypes } from 'react'
import Avatar from '../assets/Avatar'
import RelationsGroup from '../relationships/RelationsGroup'
import { UserNames, UserStats, UserInfo } from '../users/UserVitals'

class UserList extends Component {

  render() {
    const { user, showBlockMuteButton } = this.props
    const userPath = `/${user.username}`
    return (
      <div className="UserList" >
        <Avatar to={userPath} sources={user.avatar} size="large" />
        <RelationsGroup user={user} showBlockMuteButton={ showBlockMuteButton } />
        <UserNames user={user} />
        <UserStats user={user} />
        <UserInfo user={user} />
      </div>
    )
  }
}

UserList.propTypes = {
  showBlockMuteButton: PropTypes.bool,
  user: PropTypes.shape({
  }).isRequired,
}

UserList.defaultProps = {
  showBlockMuteButton: false,
}

export default UserList

