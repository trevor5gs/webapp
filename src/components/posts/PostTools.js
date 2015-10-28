import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { EyeIcon, BubbleIcon, HeartIcon, RepostIcon, ShareIcon } from '../iconography/Icons'
import * as PostActions from '../../actions/posts'

class PostTools extends React.Component {

  getToolCells() {
    const { author, currentUser, post } = this.props
    const cells = []
    cells.push(
      <Link to={`/${author.username}/post/${post.token}`} key={`eye_${post.id}`}>
        <span className="eye-tools pill">
          <EyeIcon />
          {post.viewsCount}
        </span>
      </Link>
    )
    cells.push(
      <Link to={`/${author.username}/post/${post.token}`} key={`timeAgo_${post.id}`}>
        <span className="post-time-ago">
          {new Date(post.createdAt).timeAgoInWords()}
        </span>
      </Link>
    )
    if (author.hasCommentingEnabled) {
      cells.push(
        <span className="bubble-tools" key={`bubble_${post.id}`}>
          <button>
            <BubbleIcon />
            {post.commentsCount}
          </button>
        </span>
      )
    }
    if (author.hasLovesEnabled) {
      cells.push(
        <span className="heart-tools" key={`heart_${post.id}`}>
          <button className={classNames({ active: post.loved })} onClick={ this.lovePost.bind(this) }>
            <HeartIcon />
            {post.lovesCount}
          </button>
        </span>
      )
    }
    if (author.hasRepostingEnabled) {
      cells.push(
        <span className="repost-tools" key={`repost_${post.id}`}>
          <button>
            <RepostIcon />
            {post.repostsCount}
          </button>
        </span>
      )
    }
    if (author.hasSharingEnabled) {
      cells.push(
        <span className="share-tools" key={`share_${post.id}`}>
          <button>
            <ShareIcon />
          </button>
        </span>
      )
    }
    let isOwnPost = author.id === currentUser.id
    if (isOwnPost) {
      isOwnPost = !isOwnPost
    }
    return cells
  }

  lovePost() {
    const { dispatch, post } = this.props
    if (post.loved) {
      dispatch(PostActions.unlovePost(post))
    } else {
      dispatch(PostActions.lovePost(post))
    }
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
  dispatch: React.PropTypes.func.isRequired,
  post: React.PropTypes.object.isRequired,
}

export default connect()(PostTools)

