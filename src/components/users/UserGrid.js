import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Avatar from '../assets/Avatar'
import CoverMini from '../assets/CoverMini'
import { UserNames, UserStats, UserInfo } from '../users/UserVitals'
import RelationshipContainer from '../../containers/RelationshipContainer'

class UserGrid extends Component {

  static propTypes = {
    followingCount: PropTypes.number.isRequired,
    followersCount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    lovesCount: PropTypes.number.isRequired,
    postsCount: PropTypes.number.isRequired,
    relationshipPriority: PropTypes.string,
    user: PropTypes.shape({
    }).isRequired,
    username: PropTypes.string.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    if (_.isEqual(nextProps, this.props)) {
      return false
    }
    return true
  }

  render() {
    const {
      followingCount, followersCount, lovesCount, relationshipPriority, postsCount, user, username,
    } = this.props
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
        <RelationshipContainer
          user={user}
          relationshipPriority={relationshipPriority}
          ref="RelationshipContainer"
        />
        <UserStats
          followingCount={followingCount}
          followersCount={followersCount}
          lovesCount={lovesCount}
          postsCount={postsCount}
          username={username}
        />
        <UserNames user={user} />
        <UserInfo user={user} />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const user = state.json.users[ownProps.user.id]
  return {
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    lovesCount: user.lovesCount,
    postsCount: user.postsCount,
    relationshipPriority: user.relationshipPriority,
    user,
    username: user.username,
  }
}

export default connect(mapStateToProps)(UserGrid)

