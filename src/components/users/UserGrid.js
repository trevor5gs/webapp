import React from 'react'
import { connect } from 'react-redux'
import { updateRelationship } from '../../actions/relationships'
import Avatar from './Avatar'
import CoverImage from '../covers/CoverImage'
import RelationshipButton from '../relationships/RelationshipButton'
import { UserNames, UserStats, UserInfo } from './UserVitals'


class UserGrid extends React.Component {
  handleRelationshipUpdate(vo) {
    const { userId, priority, existing } = vo
    this.props.dispatch(updateRelationship(userId, priority, existing))
  }

  render() {
    const user = this.props.user
    const userPath = `/${user.username}`
    return (
      <div className="UserGrid" >
        <CoverImage to={userPath} coverImage={user.coverImage} />
        <Avatar to={userPath} sources={user.avatar} />
        <RelationshipButton
          ref="relationshipButton"
          userId={user.id}
          priority={user.relationshipPriority}
          buttonWasClicked={this.handleRelationshipUpdate.bind(this)} />
        <UserStats user={user} />
        <UserNames user={user} />
        <UserInfo user={user} />
      </div>
    )
  }
}

UserGrid.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  user: React.PropTypes.shape({
  }).isRequired,
}

export default connect(null, null, null, { withRef: true })(UserGrid)

