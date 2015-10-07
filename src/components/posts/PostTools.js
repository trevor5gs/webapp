import React from 'react'
import { Link } from 'react-router'
import { EyeIcon, BubbleIcon, HeartIcon, RepostIcon, ShareIcon } from '../iconography/Icons'

class PostTools extends React.Component {

  getToolCells() {
    const { author, currentUser, post } = this.props
    const isOwnPost = author.id === currentUser.id
    const cells = []
    cells.push(
      <span className="eye-tools pill" key={`eye_${post.id}`}>
        <Link to={`/${author.username}/post/${post.token}`}>
          <EyeIcon />
          {post.viewsCount}
        </Link>
      </span>
    )
    cells.push(
      <span className="post-time-ago" key={`timeAgo_${post.id}`}>
        {new Date(post.createdAt).timeAgoInWords()}
      </span>
    )
    if (author.hasCommentingEnabled) {
      cells.push(
        <span className="bubble-tools" key={`bubble_${post.id}`}>
          <a href="">
            <BubbleIcon />
            {post.commentsCount}
          </a>
        </span>
      )
    }
    if (author.hasLovesEnabled) {
      cells.push(
        <span className="heart-tools" key={`heart_${post.id}`}>
          <a href="">
            <HeartIcon />
            {post.lovesCount}
          </a>
        </span>
      )
    }
    if (author.hasRepostingEnabled) {
      cells.push(
        <span className="repost-tools" key={`repost_${post.id}`}>
          <a href="">
            <RepostIcon />
            {post.repostsCount}
          </a>
        </span>
      )
    }
    if (author.hasSharingEnabled) {
      cells.push(
        <span className="share-tools" key={`share_${post.id}`}>
          <a href="">
            <ShareIcon />
          </a>
        </span>
      )
    }
    if (isOwnPost) {
      // add edit/delete items
    }
    return cells
  }

  render() {
    const { post } = this.props
    if (!post) { return null }
    return (
      <section className="PostTools">
        {this.getToolCells()}
      </section>
    )
  }

}

PostTools.propTypes = {
  author: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object.isRequired,
  post: React.PropTypes.object.isRequired,
}

export default PostTools

