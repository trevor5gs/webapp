import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'
import Hint from '../hints/Hint'

const UserAvatar = ({ user }) =>
  <Link className="UserAvatar" to={ `/${user.username}` }>
    <Avatar
      priority={ user.relationshipPriority }
      sources={ user.avatar }
      userId={ `${user.id}` }
      username={ user.username }
    />
    <Hint>{ `@${user.username}` }</Hint>
  </Link>

UserAvatar.propTypes = {
  user: PropTypes.any,
}

export default UserAvatar

