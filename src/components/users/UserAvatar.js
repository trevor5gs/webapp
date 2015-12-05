import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'
import Hint from '../hints/Hint'

class UserAvatar extends Component {
  static propTypes = {
    user: PropTypes.any,
  }

  render() {
    const { user } = this.props
    return (
      <Link className="UserAvatar" to={`/${user.username}`}>
        <Avatar sources={user.avatar} />
        <Hint>{`@${user.username}`}</Hint>
      </Link>
    )
  }
}

export default UserAvatar

