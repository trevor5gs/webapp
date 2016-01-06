import React, { Component, PropTypes } from 'react'
import Avatar from '../assets/Avatar'
import RelationsGroup from '../relationships/RelationsGroup'
import { UserNames, UserStats, UserInfo } from '../users/UserVitals'

class UserList extends Component {

  render() {
    const user = this.props.user
    const userPath = `/${user.username}`
    return (
      <div className="UserList" >
        <Avatar to={userPath} sources={user.avatar} size="large" />
        <RelationsGroup user={user} />
        <UserNames user={user} />
        <UserStats user={user} />
        <UserInfo user={user} />
      </div>
    )
  }
}

UserList.propTypes = {
  user: PropTypes.shape({
  }).isRequired,
}

export default UserList

