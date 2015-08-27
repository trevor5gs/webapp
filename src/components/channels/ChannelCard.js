import React from 'react'
import { Link } from 'react-router'

class ChannelCard extends React.Component {
  render() {
    const user = this.props.user
    const avatar = user.avatar.regular.url
    const style = { backgroundImage: `url(${avatar})` }
    return (
      <figure className="ChannelCard" style={style}>
        <h2>{user.name}</h2>
        <Link to="#">Follow</Link>
      </figure>
    )
  }
}

ChannelCard.propTypes = {
  user: React.PropTypes.shape({
  }),
}

export default ChannelCard

