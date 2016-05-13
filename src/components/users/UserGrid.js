import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Avatar from '../assets/Avatar'
import CoverMini from '../assets/CoverMini'
import RelationsGroup from '../relationships/RelationsGroup'
import { UserNames, UserStats, UserInfo } from '../users/UserVitals'

class UserGrid extends Component {

  static propTypes = {
    relationshipPriority: PropTypes.string,
    user: PropTypes.shape({
    }).isRequired,
  }

  shouldComponentUpdate(nextProps) {
    if (_.isEqual(nextProps, this.props)) {
      return false
    }
    return true
  }

  render() {
    const { relationshipPriority, user } = this.props
    const userPath = `/${user.username}`
    return (
      <div className="UserGrid" >
        <CoverMini to={userPath} coverImage={user.coverImage} />
        <Avatar
          priority={relationshipPriority}
          sources={user.avatar}
          to={userPath}
          userId={`${user.id}`}
          username={user.username}
        />
        <RelationsGroup
          user={user}
          relationshipPriority={relationshipPriority}
          ref="RelationsGroup"
        />
        <UserStats user={user} />
        <UserNames user={user} />
        <UserInfo user={user} />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const user = state.json.users[ownProps.user.id]
  return {
    relationshipPriority: user.relationshipPriority,
    user,
  }
}

export default connect(mapStateToProps)(UserGrid)

