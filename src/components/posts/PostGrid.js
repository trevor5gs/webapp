import React from 'react'
import Avatar from './Avatar'

class PostGrid extends React.Component {
  render() {
    const { post, user } = this.props
    const avatar = user.avatar.regular.url
    return (
      <div className="PostGrid" >
        <Avatar imgSrc={avatar} />
        <div>{post.authorId}</div>
      </div>
    )
  }
}

PostGrid.propTypes = {
  post: React.PropTypes.shape({
  }).isRequired,
  user: React.PropTypes.shape({
  }).isRequired,
}

export default PostGrid

