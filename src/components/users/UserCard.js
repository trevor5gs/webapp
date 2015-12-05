import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateRelationship } from '../../actions/relationships'
import RelationshipImageButton from '../relationships/RelationshipImageButton'

class UserCard extends Component {
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

export default connect(null, null, null, { withRef: true })(UserCard)

