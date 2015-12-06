import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'

class Credits extends Component {
  static propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string,
      avatar: PropTypes.shape({}),
    }).isRequired,
  }

  render() {
    const { user } = this.props
    const { username, avatar } = user
    return (
      <Link className="Credits" to={`/${username}`}>
        <span className="CreditsBy">Posted by</span>
        <span className="CreditsAuthor">@{username}</span>
        <Avatar sources={avatar} />
      </Link>
    )
  }
}

export default Credits

