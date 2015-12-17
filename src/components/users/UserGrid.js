import React, { Component, PropTypes } from 'react'
import Avatar from '../assets/Avatar'
import CoverMini from '../assets/CoverMini'
import RelationsGroup from '../relationships/RelationsGroup'
import { UserNames, UserStats, UserInfo } from '../users/UserVitals'

class UserGrid extends Component {
  static propTypes = {
    user: PropTypes.shape({
    }).isRequired,
  }

  render() {
    const user = this.props.user
    const userPath = `/${user.username}`
    return (
      <div className="UserGrid" >
        <CoverMini to={userPath} coverImage={user.coverImage} />
        <Avatar to={userPath} sources={user.avatar} />
        <RelationsGroup user={user} ref="RelationsGroup" />
        <UserStats user={user} />
        <UserNames user={user} />
        <UserInfo user={user} />
      </div>
    )
  }
}

export default UserGrid

