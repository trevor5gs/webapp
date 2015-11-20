import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { updateRelationship } from '../../actions/relationships'
import Avatar from './Avatar'
import RelationshipButton from '../buttons/RelationshipButton'
import { UserNames, UserStats, UserInfo } from './UserVitals'


class UserList extends React.Component {
  handleRelationshipUpdate(vo) {
    const { userId, priority, existing } = vo
    this.props.dispatch(updateRelationship(userId, priority, existing))
  }

  render() {
    const user = this.props.user
    const avatar = user.avatar ? user.avatar.large.url : ''
    const userPath = `/${user.username}`
    return (
      <div className="UserList" >
        <Link to={userPath} className="AvatarLink" >
          <Avatar imgSrc={avatar} />
        </Link>
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

