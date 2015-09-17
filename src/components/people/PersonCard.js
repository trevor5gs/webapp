import React from 'react'
import RelationshipButton from '../buttons/RelationshipButton'

class PersonCard extends React.Component {
  render() {
    const user = this.props.user
    const coverSrc = user.coverImage.hdpi.url
    const style = { backgroundImage: `url(${coverSrc})` }
    return (
      <div className="PersonCard" style={style}>
        <h2>{user.name}</h2>
        <RelationshipButton priority={user.relationship_priority} data-user-id={user.id} />
      </div>
    )
  }
}

PersonCard.propTypes = {
  user: React.PropTypes.shape({
  }).isRequired,
}

export default PersonCard

