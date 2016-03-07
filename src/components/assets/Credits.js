import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'

class Credits extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    user: PropTypes.shape({
      avatar: PropTypes.shape({}),
      username: PropTypes.string,
    }).isRequired,
  };

  // Typically a passed through tracking event sent before following the link
  onClickCredits = () => {
    const { onClick } = this.props
    if (onClick) {
      onClick()
    }
  };

  render() {
    const { user } = this.props
    const { username, avatar } = user
    return (
      <Link className="Credits" onClick={ this.onClickCredits } to={`/${username}`}>
        <span className="CreditsBy">Posted by</span>
        <span className="CreditsAuthor">@{username}</span>
        <Avatar sources={avatar} />
      </Link>
    )
  }
}

export default Credits

