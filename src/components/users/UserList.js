import React from 'react'
import { connect } from 'react-redux'
import { updateRelationship } from '../../actions/relationships'
import Avatar from './Avatar'
import RelationshipButton from '../relationships/RelationshipButton'
import { UserNames, UserStats, UserInfo } from './UserVitals'


class UserList extends React.Component {
  handleRelationshipUpdate(vo) {
    const { userId, priority, existing } = vo
    this.props.dispatch(updateRelationship(userId, priority, existing))
  }

  render() {
    const user = this.props.user
    const userPath = `/${user.username}`
    return (
      <div className="UserList" >
        <Avatar to={userPath} sources={user.avatar} size="large" />
        <RelationshipButton
          ref="relationshipButton"
          userId={user.id}
          priority={user.relationshipPriority}
          buttonWasClicked={this.handleRelationshipUpdate.bind(this)} />
        <UserNames user={user} />
        <UserStats user={user} />
        <UserInfo user={user} />
      </div>
    )
  }
}

UserList.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  user: React.PropTypes.shape({
  }).isRequired,
}

export default connect(null, null, null, { withRef: true })(UserList)

