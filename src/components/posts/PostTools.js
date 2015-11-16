import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Hint from '../hints/Hint'
import { openModal } from '../../actions/modals'
import ShareDialog from '../dialogs/ShareDialog'
import { EyeIcon, BubbleIcon, HeartIcon, RepostIcon, ShareIcon, PencilIcon, XBoxIcon, FlagIcon, ChevronIcon } from '../iconography/Icons'
import * as PostActions from '../../actions/posts'

class PostTools extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isMoreToolActive: false,
    }
  }

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
          <button onClick={ this.sharePost.bind(this) }>
            <ShareIcon />
            <Hint>Share</Hint>
          </button>
        </span>
      )
    }
    cells.push(
      <span className="PostTool TimeAgoTool ShyTool" key={`TimeAgoTool_${post.id}`}>
        <Link to={`/${author.username}/post/${post.token}`}>
          <span className="PostToolValue">{new Date(post.createdAt).timeAgoInWords()}</span>
          <Hint>Visit</Hint>
        </Link>
      </span>
    )
    if (isOwnPost) {
      cells.push(
        <span className="PostTool EditTool ShyTool" key={`EditTool_${post.id}`}>
          <button>
            <PencilIcon />
            <Hint>Edit</Hint>
          </button>
        </span>
      )
      cells.push(
        <span className="PostTool DeleteTool ShyTool" key={`DeleteTool_${post.id}`}>
          <button>
            <XBoxIcon />
            <Hint>Delete</Hint>
          </button>
        </span>
      )
    } else {
      cells.push(
        <span className="PostTool FlagTool ShyTool" key={`FlagTool_${post.id}`}>
          <button>
            <FlagIcon />
            <Hint>Flag</Hint>
          </button>
        </span>
      )
    }
    cells.push(
      <span className={"PostTool MoreTool"} key={`MoreTool_${post.id}`}>
        <button onClick={ this.toggleActiveMoreTool.bind(this) }>
          <ChevronIcon />
          <Hint>More</Hint>
        </button>
      </span>
    )
    return cells
  }

  toggleActiveMoreTool() {
    this.setState({ isMoreToolActive: !this.state.isMoreToolActive })
  }

  lovePost() {
    const { dispatch, post } = this.props
    if (post.loved) {
      dispatch(PostActions.unlovePost(post))
    } else {
      dispatch(PostActions.lovePost(post))
    }
  }

  sharePost() {
    const { dispatch, post } = this.props
    dispatch(openModal(<ShareDialog postUrl={ post.token }/>))
  }

  render() {
    const { post } = this.props
    if (!post) { return null }
    const classes = classNames(
      'PostTools',
      { isMoreToolActive: this.state.isMoreToolActive },
    )
    return (
      <footer className={classes}>
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

