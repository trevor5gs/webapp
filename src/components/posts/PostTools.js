import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { replace } from 'react-router-redux'
import classNames from 'classnames'
import { openModal, closeModal } from '../../actions/modals'
import * as postActions from '../../actions/posts'
import { trackEvent } from '../../actions/tracking'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import FlagDialog from '../dialogs/FlagDialog'
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
import { numberToHuman } from '../../vendor/number_to_human'

class PostTools extends Component {

  static propTypes = {
    author: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    previousPath: PropTypes.string,
  };

  componentWillMount() {
    this.state = {
      isMoreToolActive: false,
      isCommentsActive: false,
    }
  }

  getToolCells() {
    const { author, currentUser, isLoggedIn, post } = this.props
    const isOwnPost = currentUser && author.id === currentUser.id
    const cells = []
    cells.push(
      <span
        className={classNames('PostTool', 'ViewsTool', { asPill: isLoggedIn })}
        key={`ViewsTool_${post.id}`}
      >
        <Link to={`/${author.username}/post/${post.token}`}>
          <EyeIcon />
          <span className="PostToolValue">{post.viewsCountRounded}</span>
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
        <span
          className="PostTool CommentTool"
          data-count={ post.commentsCount }
          key={`CommentTool_${post.id}`}
        >
          { isLoggedIn ?
            <button onClick={ this.toggleComments } >
              <BubbleIcon />
              <span className="PostToolValue" >
                {numberToHuman(post.commentsCount, false)}
              </span>
              <Hint>Comment</Hint>
            </button> :
            <Link to={`/${author.username}/post/${post.token}`}>
              <BubbleIcon />
              <span className="PostToolValue" >
                {numberToHuman(post.commentsCount, false)}
              </span>
              <Hint>Comment</Hint>
            </Link>
          }
        </span>
      )
    }
    if (author.hasLovesEnabled) {
      cells.push(
        <span
          className="PostTool LoveTool"
          data-count={ post.lovesCount }
          key={`LoveTool_${post.id}`}
        >
          <button
            className={classNames({ active: post.loved, hasPostToolDrawer: post.lovesCount > 0 })}
            onClick={ this.lovePost }
          >
            <HeartIcon />
            <Hint>Love</Hint>
          </button>
          <button
            className={classNames({ active: post.loved }, 'PostToolDrawerButton')}
            onClick={ this.toggleLovers }
          >
            <span className="PostToolValue" >
              { numberToHuman(post.lovesCount, false) }
            </span>
            <Hint>Loved by</Hint>
          </button>
        </span>
      )
    }
    if (!isOwnPost && author.hasRepostingEnabled) {
      cells.push(
        <span
          className="PostTool RepostTool"
          data-count={post.repostsCount}
          key={`RepostTool_${post.id}`}
        >
          <button
            className={classNames({ hasPostToolDrawer: post.repostsCount > 0 })}
            onClick={ this.repostPost }
          >
            <RepostIcon />
            <Hint>Repost</Hint>
          </button>
          <button className="PostToolDrawerButton" onClick={ this.toggleReposters }>
            <span className="PostToolValue" >
              {numberToHuman(post.repostsCount, false)}
            </span>
            <Hint>Reposted by</Hint>
          </button>
        </span>
      )
    }
    if (author.hasSharingEnabled) {
      cells.push(
        <span
          className={classNames('PostTool', 'ShareTool', { asPill: !isLoggedIn })}
          key={`ShareTool_${post.id}`}
        >
          <button onClick={ this.sharePost }>
            <ShareIcon />
            <Hint>Share</Hint>
          </button>
        </span>
      )
    }
    if (isLoggedIn) {
      if (isOwnPost) {
        cells.push(
          <span className="PostTool EditTool ShyTool" key={`EditTool_${post.id}`}>
            <button onClick={ this.editPost }>
              <PencilIcon />
              <Hint>Edit</Hint>
            </button>
          </span>
        )
        cells.push(
          <span className="PostTool DeleteTool ShyTool" key={`DeleteTool_${post.id}`}>
            <button onClick={ this.deletePost }>
              <XBoxIcon />
              <Hint>Delete</Hint>
            </button>
          </span>
        )
      } else {
        cells.push(
          <span className="PostTool FlagTool ShyTool" key={`FlagTool_${post.id}`}>
            <button onClick={ this.flagPost }>
              <FlagIcon />
              <Hint>Flag</Hint>
            </button>
          </span>
        )
      }
    }
    cells.push(
      <span className={"PostTool MoreTool"} key={`MoreTool_${post.id}`}>
        <button onClick={ this.toggleActiveMoreTool }>
          <ChevronIcon />
        </button>
      </span>
    )
    return cells
  }

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  };

  toggleActiveMoreTool = () => {
    this.setState({ isMoreToolActive: !this.state.isMoreToolActive })
  };

  toggleComments = () => {
    const { dispatch, post } = this.props
    const nextShowComments = !post.showComments
    this.setState({ isCommentsActive: nextShowComments })
    dispatch(postActions.toggleComments(post, nextShowComments))
  };

  lovePost = () => {
    const { dispatch, isLoggedIn, post } = this.props
    if (!isLoggedIn) {
      return this.signUp()
    }
    if (post.loved) {
      dispatch(postActions.unlovePost(post))
    } else {
      dispatch(postActions.lovePost(post))
    }
  };
  toggleLovers = () => {
    const { dispatch, post } = this.props
    const showLovers = !post.showLovers
    dispatch(postActions.toggleLovers(post, showLovers))
  };
  toggleReposters = () => {
    const { dispatch, post } = this.props
    const showReposters = !post.showReposters
    dispatch(postActions.toggleReposters(post, showReposters))
  };

  sharePost = () => {
    const { author, dispatch, post } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog author={author} post={post} trackEvent={action} />))
    return dispatch(trackEvent('open-share-dialog'))
  };

  signUp = () => {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'asDecapitated'))
    return dispatch(trackEvent('open-registration-request-post-tools'))
  };

  flagPost = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <FlagDialog
        onResponse={ this.postWasFlagged }
        onConfirm={ this.closeModal }
      />))
  };

  postWasFlagged = ({ flag }) => {
    const { dispatch, post } = this.props
    dispatch(postActions.flagPost(post, flag))
  };

  editPost = () => {
    const { dispatch, post } = this.props
    dispatch(postActions.toggleEditing(post, true))
    dispatch(postActions.loadEditablePost(post))
  };

  repostPost = () => {
    const { dispatch, isLoggedIn, post } = this.props
    if (!isLoggedIn) {
      return this.signUp()
    }
    if (!post.reposted) {
      dispatch(postActions.toggleReposting(post, true))
      dispatch(postActions.loadEditablePost(post))
    }
  };

  deletePost = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Delete Post?"
        onConfirm={ this.deletePostConfirmed }
        onRejected={ this.closeModal }
      />))
  };

  deletePostConfirmed = () => {
    const { dispatch, pathname, post, previousPath } = this.props
    this.closeModal()
    dispatch(postActions.deletePost(post))
    if (pathname.match(post.token)) {
      dispatch(replace(previousPath || '/'))
    }
  };

  render() {
    const { post } = this.props
    if (!post) { return null }
    const classes = classNames(
      'PostTools',
      { isMoreToolActive: this.state.isMoreToolActive },
      { isCommentsActive: this.state.isCommentsActive },
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
    pathname: document.location.pathname,
    previousPath: state.routing.previousPath,
  }
}

export default connect(mapStateToProps)(PostTools)
