import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'

const Credits = ({ user, onClick }) => {
  const { username, avatar } = user
  return (
    <Link className="Credits" onClick={onClick} to={`/${username}`}>
      <span className="CreditsBy">Posted by</span>
      <span className="CreditsAuthor">@{username}</span>
      <Avatar
        priority={user.relationshipPriority}
        sources={avatar}
        userId={`${user.id}`}
        username={username}
      />
    </Link>
  )
}

Credits.propTypes = {
  onClick: PropTypes.func,
  user: PropTypes.shape({
    avatar: PropTypes.shape({}),
    username: PropTypes.string,
  }).isRequired,
}

export default Credits

