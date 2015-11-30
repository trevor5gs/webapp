import React from 'react'
import { connect } from 'react-redux'
import { updateRelationship } from '../../actions/relationships'
import RelationshipImageButton from '../relationships/RelationshipImageButton'

class UserCard extends React.Component {
  handleRelationshipUpdate(vo) {
    const { userId, priority, existing } = vo
    this.props.dispatch(updateRelationship(userId, priority, existing))
  }

  render() {
    const user = this.props.user
    return (
      <div className="UserCard" >
        <RelationshipImageButton
          ref="relationshipButton"
          username={'@' + user.username}
          userId={user.id}
          coverSrc={user.coverImage.hdpi.url}
          priority={user.relationshipPriority}
          buttonWasClicked={this.handleRelationshipUpdate.bind(this)} />
      </div>
    )
  }
}

UserCard.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  user: React.PropTypes.shape({
  }).isRequired,
}

export default connect(null, null, null, { withRef: true })(UserCard)

