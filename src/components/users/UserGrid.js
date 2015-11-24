import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { updateRelationship } from '../../actions/relationships'
import Avatar from './Avatar'
import CoverImage from '../covers/CoverImage'
import RelationshipButton from '../buttons/RelationshipButton'
import { UserNames, UserStats, UserInfo } from './UserVitals'


class UserGrid extends React.Component {
  handleRelationshipUpdate(vo) {
    const { userId, priority, existing } = vo
    this.props.dispatch(updateRelationship(userId, priority, existing))
  }

  render() {
    const user = this.props.user
    const avatar = user.avatar ? user.avatar.regular.url : ''
    const userPath = `/${user.username}`
    return (
      <div className="UserGrid" >
        <CoverImage path={userPath} coverImage={user.coverImage} />
        <Link to={userPath} className="AvatarLink" >
          <Avatar imgSrc={avatar} />
        </Link>
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

