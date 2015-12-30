import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'
import Hint from '../hints/Hint'

const UserAvatar = ({ user }) =>
  <Link className="UserAvatar" to={`/${user.username}`}>
    <Avatar sources={user.avatar} />
    <Hint>{`@${user.username}`}</Hint>
  </Link>

UserAvatar.propTypes = {
  user: PropTypes.any,
}

export default UserAvatar

