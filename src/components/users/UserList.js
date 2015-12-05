import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateRelationship } from '../../actions/relationships'
import Avatar from '../assets/Avatar'
import RelationshipButton from '../relationships/RelationshipButton'
import { UserNames, UserStats, UserInfo } from '../users/UserVitals'

class UserList extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.shape({
    }).isRequired,
  }

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

export default connect(null, null, null, { withRef: true })(UserList)

