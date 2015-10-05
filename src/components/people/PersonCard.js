import React from 'react'
import { connect } from 'react-redux'
import { updateRelationship } from '../../actions/relationships'
import RelationshipImageButton from '../buttons/RelationshipImageButton'

class PersonCard extends React.Component {
  handleRelationshipUpdate(vo) {
    const { userId, priority, existing } = vo
    this.props.dispatch(updateRelationship(userId, priority, existing))
  }

  render() {
    const user = this.props.user
    const coverSrc = user.coverImage.hdpi.url
    const style = { backgroundImage: `url(${coverSrc})` }
    return (
      <div className="PersonCard" >
        <RelationshipImageButton
          ref="relationshipButton"
          style={style}
          label={'@' + user.username}
          userId={user.id}
          priority={user.relationshipPriority}
          buttonWasClicked={this.handleRelationshipUpdate.bind(this)} />
      </div>
    )
  }
}

PersonCard.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  user: React.PropTypes.shape({
  }).isRequired,
}

export default connect()(PersonCard)

