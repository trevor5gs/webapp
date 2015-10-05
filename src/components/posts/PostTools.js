import React from 'react'
import { EyeIcon, BubbleIcon, HeartIcon, RepostIcon, ShareIcon } from '../iconography/Icons'

class PostTools extends React.Component {

  render() {
    const { post } = this.props
    if (!post) { return null }
    const createdAtDate = new Date(post.createdAt)
    return (
      <section className="PostTools">
        <span className="eye-tools pill">
          <a href="">
            <EyeIcon />
            {post.viewsCount}
          </a>
        </span>
        <span className="post-time-ago">
          {createdAtDate.timeAgoInWords()}
        </span>
        <span className="bubble-tools">
          <a href="">
            <BubbleIcon />
            {post.commentsCount}
          </a>
        </span>
        <span className="heart-tools">
          <a href="">
            <HeartIcon />
            {post.lovesCount}
          </a>
        </span>
        <span className="repost-tools">
          <a href="">
            <RepostIcon />
            {post.repostsCount}
          </a>
        </span>
        <span className="share-tools">
          <a href="">
            <ShareIcon />
          </a>
        </span>
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

