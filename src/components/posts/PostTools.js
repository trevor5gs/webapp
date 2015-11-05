import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Hint from '../hints/Hint'
import { EyeIcon, BubbleIcon, HeartIcon, RepostIcon, ShareIcon, PencilIcon, XBoxIcon, FlagIcon } from '../iconography/Icons'
import * as PostActions from '../../actions/posts'

class PostTools extends React.Component {

  getToolCells() {
    const { author, currentUser, post } = this.props
    const isOwnPost = currentUser && author.id === currentUser.id
    const cells = []
    cells.push(
      <span className="PostTool ViewsTool" key={`ViewsTool_${post.id}`}>
        <Link to={`/${author.username}/post/${post.token}`}>
          <EyeIcon />
          <span className="PostToolValue">{post.viewsCount}</span>
          <Hint>Views</Hint>
        </Link>
      </span>
    )
    cells.push(
      <span className="PostTool TimeAgoTool" key={`TimeAgoTool_${post.id}`}>
        <Link to={`/${author.username}/post/${post.token}`}>
          <span className="PostToolValue">{new Date(post.createdAt).timeAgoInWords()}</span>
          <Hint>Visit</Hint>
        </Link>
      </span>
    )
    if (author.hasCommentingEnabled) {
      cells.push(
        <span className="PostTool CommentTool" key={`CommentTool_${post.id}`}>
          <button>
            <BubbleIcon />
            <span className="PostToolValue" data-count={post.commentsCount} >{post.commentsCount}</span>
            <Hint>Comment</Hint>
          </button>
        </span>
      )
    }
    if (author.hasLovesEnabled) {
      cells.push(
        <span className="PostTool LoveTool" key={`LoveTool_${post.id}`}>
          <button className={classNames({ active: post.loved })} onClick={ this.lovePost.bind(this) }>
            <HeartIcon />
            <span className="PostToolValue" data-count={post.lovesCount}>{post.lovesCount}</span>
            <Hint>Love</Hint>
          </button>
        </span>
      )
    }
    if (author.hasRepostingEnabled) {
      cells.push(
        <span className="PostTool RepostTool" key={`RepostTool_${post.id}`}>
          <button>
            <RepostIcon />
            <span className="PostToolValue" data-count={post.repostsCount}>{post.repostsCount}</span>
            <Hint>Repost</Hint>
          </button>
        </span>
      )
    }
    if (author.hasSharingEnabled) {
      cells.push(
        <span className="PostTool ShareTool" key={`ShareTool_${post.id}`}>
          <button>
            <ShareIcon />
            <Hint>Share</Hint>
          </button>
        </span>
      )
    }
    if (isOwnPost) {
      cells.push(
        <span className="PostTool EditTool shy" key={`EditTool_${post.id}`}>
          <button>
            <PencilIcon />
            <Hint>Edit</Hint>
          </button>
        </span>
      )
      cells.push(
        <span className="PostTool DeleteTool shy" key={`DeleteTool_${post.id}`}>
          <button>
            <XBoxIcon />
            <Hint>Delete</Hint>
          </button>
        </span>
      )
    } else {
      cells.push(
        <span className="PostTool FlagTool shy" key={`FlagTool_${post.id}`}>
          <button>
            <FlagIcon />
            <Hint>Flag</Hint>
          </button>
        </span>
      )
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
      <footer className="PostTools">
        {this.getToolCells()}
      </footer>
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

