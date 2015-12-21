import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { pushState } from 'redux-router'
import classNames from 'classnames'
import { openModal } from '../../actions/modals'
import * as PostActions from '../../actions/posts'
import { trackEvent } from '../../actions/tracking'
import RegistrationRequestDialog from '../dialogs/RegistrationRequestDialog'
import ShareDialog from '../dialogs/ShareDialog'
import Hint from '../hints/Hint'
import {
  BubbleIcon,
  ChevronIcon,
  EyeIcon,
  FlagIcon,
  HeartIcon,
  PencilIcon,
  RepostIcon,
  ShareIcon,
  XBoxIcon,
} from '../posts/PostIcons'

class PostTools extends Component {
  static propTypes = {
    author: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      isMoreToolActive: false,
    }
  }

  getToolCells() {
    const { author, currentUser, isLoggedIn, post } = this.props
    const isOwnPost = currentUser && author.id === currentUser.id
    const cells = []
    cells.push(
      <span className={classNames('PostTool', 'ViewsTool', { asPill: isLoggedIn })} key={`ViewsTool_${post.id}`}>
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
          <button onClick={ this.toggleComments.bind(this) }>
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
          <button onClick={ this.signUp.bind(this) }>
            <RepostIcon />
            <span className="PostToolValue" data-count={post.repostsCount}>{post.repostsCount}</span>
            <Hint>Repost</Hint>
          </button>
        </span>
      )
    }
    if (author.hasSharingEnabled) {
      cells.push(
        <span className={classNames('PostTool', 'ShareTool', { asPill: !isLoggedIn })} key={`ShareTool_${post.id}`}>
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
    if (isLoggedIn) {
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

  toggleComments() {
    const { author, dispatch, isLoggedIn, post } = this.props
    if (!isLoggedIn) {
      dispatch(pushState(window.history.state, `/${author.username}/post/${post.token}`))
    }
  }

  lovePost() {
    const { dispatch, isLoggedIn, post } = this.props
    if (!isLoggedIn) {
      return this.signUp()
    }
    if (post.loved) {
      dispatch(PostActions.unlovePost(post))
    } else {
      dispatch(PostActions.lovePost(post))
    }
  }

  sharePost() {
    const { author, dispatch, post } = this.props
    dispatch(openModal(<ShareDialog
                       author={author}
                       post={post}
                       trackEvent={bindActionCreators(trackEvent, dispatch)}
                       />))
    return dispatch(trackEvent('open-share-dialog'))
  }

  signUp() {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />))
    return dispatch(trackEvent('open-registration-request-post-tools'))
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


function mapStateToProps(state) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
  }
}


export default connect(mapStateToProps)(PostTools)

