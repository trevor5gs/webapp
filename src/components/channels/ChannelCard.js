import React from 'react'
import RelationshipButton from '../buttons/RelationshipButton'

class ChannelCard extends React.Component {
  render() {
    const user = this.props.user
    const avatar = user.avatar.regular.url
    const style = { backgroundImage: `url(${avatar})` }
    return (
      <div className="ChannelCard" style={style}>
        <h2>{user.name}</h2>
        <RelationshipButton priority={user.relationship_priority} data-user-id={user.id} />
      </div>
    )
  }
}

ChannelCard.propTypes = {
  user: React.PropTypes.shape({
  }).isRequired,
}

export default ChannelCard

