import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { push, replace } from 'react-router-redux'
import { set } from 'lodash'
import classNames from 'classnames'
import { LOAD_STREAM_REQUEST } from '../../constants/action_types'
import { COMMENTS, POSTS } from '../../constants/mapping_types'
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
    deviceSize: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isCommentsRequesting: PropTypes.bool,
    isGridLayout: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    isRepostAnimating: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
    postCommentsCount: PropTypes.number,
    postLoved: PropTypes.bool,
    postLovesCount: PropTypes.number,
    postReposted: PropTypes.bool,
    postRepostsCount: PropTypes.number,
    postShowComments: PropTypes.bool,
    postShowLovers: PropTypes.bool,
    postShowReposters: PropTypes.bool,
    postViewsCountRounded: PropTypes.string,
    post: PropTypes.object.isRequired,
    previousPath: PropTypes.string,
  }

  componentWillMount() {
    this.state = {
      isCommentsActive: false,
      isRepostAnimating: false,
      postShowComments: false,
      postShowLovers: false,
      postShowReposters: false,
    }
  }

  onClickToggleComments = () => {
    const { author, dispatch, isLoggedIn, post, postShowComments } = this.props
    if (isLoggedIn) {
      const nextShowComments = !postShowComments
      this.setState({ isCommentsActive: nextShowComments })
      dispatch(postActions.toggleComments(post, nextShowComments))
    } else {
      dispatch(push(`/${author.username}/post/${post.token}`))
    }
  }

  onClickLovePost = () => {
    const { dispatch, isLoggedIn, post, postLoved } = this.props
    if (!isLoggedIn) {
      this.signUp()
      return
    }
    if (postLoved) {
      dispatch(postActions.unlovePost(post))
    } else {
      dispatch(postActions.lovePost(post))
      dispatch(trackEvent('web_production.post_actions_love'))
    }
  }

  onClickToggleLovers = () => {
    const { dispatch, isGridLayout, isLoggedIn, pathname, post, postShowLovers } = this.props
    if (!isLoggedIn) {
      this.signUp()
      return
    }
    const detailLink = this.getPostDetailLink()
    if (isGridLayout && pathname !== detailLink) {
      dispatch(push(detailLink))
    } else {
      const showLovers = !postShowLovers
      dispatch(postActions.toggleLovers(post, showLovers))
    }
  }

  onClickToggleReposters = () => {
    const { dispatch, isGridLayout, isLoggedIn, pathname, post, postShowReposters } = this.props
    if (!isLoggedIn) {
      this.signUp()
      return
    }
    const detailLink = this.getPostDetailLink()
    if (isGridLayout && pathname !== detailLink) {
      dispatch(push(detailLink))
    } else {
      const showReposters = !postShowReposters
      dispatch(postActions.toggleReposters(post, showReposters))
    }
  }

  onClickSharePost = () => {
    const { author, dispatch, post } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog author={author} post={post} trackEvent={action} />))
    dispatch(trackEvent('open-share-dialog'))
  }

  onClickFlagPost = () => {
    const { deviceSize, dispatch } = this.props
    dispatch(openModal(
      <FlagDialog
        deviceSize={deviceSize}
        onResponse={this.onPostWasFlagged}
        onConfirm={this.closeModal}
      />))
  }

  onPostWasFlagged = ({ flag }) => {
    const { dispatch, post } = this.props
    dispatch(postActions.flagPost(post, flag))
  }

  onClickEditPost = () => {
    const { dispatch, post } = this.props
    dispatch(postActions.toggleEditing(post, true))
    dispatch(postActions.loadEditablePost(post.id))
  }

  onClickRepostPost = () => {
    const { dispatch, isLoggedIn, post, postReposted } = this.props
    if (!isLoggedIn) {
      this.signUp()
      return
    }
    if (!postReposted) {
      dispatch(postActions.toggleReposting(post, true))
      dispatch(postActions.loadEditablePost(post.id))
    }
  }

  onClickDeletePost = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Delete Post?"
        onConfirm={this.onCofirmDeletePost}
        onDismiss={this.closeModal}
      />))
  }

  onCofirmDeletePost = () => {
    const { dispatch, pathname, post, previousPath } = this.props
    this.closeModal()
    const action = postActions.deletePost(post)
    if (pathname.match(post.token)) {
      set(action, 'meta.successAction', replace(previousPath || '/'))
    }
    dispatch(action)
  }

  getPostDetailLink() {
    const { author, post } = this.props
    return `/${author.username}/post/${post.token}`
  }

  getToolCells() {
    const { author, isLoggedIn, isOwnPost, isRepostAnimating, post,
      postReposted, postRepostsCount,
      postLoved, postLovesCount,
      postViewsCountRounded, postCommentsCount,
    } = this.props
    const cells = []
    cells.push(
      <span
        className={classNames('PostTool', 'ViewsTool', { asPill: isLoggedIn })}
        key={`ViewsTool_${post.id}`}
      >
        <Link to={this.getPostDetailLink()}>
          <EyeIcon />
          <span className="PostToolValue">{postViewsCountRounded}</span>
          <Hint>Views</Hint>
        </Link>
      </span>
    )
    cells.push(
      <span className="PostTool TimeAgoTool" key={`TimeAgoTool_${post.id}`}>
        <Link to={this.getPostDetailLink()}>
          <span className="PostToolValue">{new Date(post.createdAt).timeAgoInWords()}</span>
          <Hint>Visit</Hint>
        </Link>
      </span>
    )
    if (author.hasCommentingEnabled) {
      cells.push(
        <span
          className="PostTool CommentTool"
          data-count={postCommentsCount}
          key={`CommentTool_${post.id}`}
        >
          {isLoggedIn ?
            <button onClick={this.onClickToggleComments} >
              <BubbleIcon />
              <span className="PostToolValue" >
                {numberToHuman(postCommentsCount, false)}
              </span>
              <Hint>Comment</Hint>
            </button> :
            <Link to={this.getPostDetailLink()}>
              <BubbleIcon />
              <span className="PostToolValue" >
                {numberToHuman(postCommentsCount, false)}
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
          data-count={postLovesCount}
          key={`LoveTool_${post.id}`}
        >
          <button
            className={classNames({ isActive: postLoved, hasPostToolDrawer: postLovesCount > 0 })}
            onClick={this.onClickLovePost}
          >
            <HeartIcon />
            <Hint>Love</Hint>
          </button>
          <button
            className={classNames({ isActive: postLoved }, 'PostToolDrawerButton')}
            onClick={this.onClickToggleLovers}
          >
            <span className="PostToolValue" >
              {numberToHuman(postLovesCount, false)}
            </span>
            <Hint>Loved by</Hint>
          </button>
        </span>
      )
    }
    if (author.hasRepostingEnabled && !(isOwnPost && parseInt(postRepostsCount, 10) === 0)) {
      const repostIcon = <RepostIcon className={classNames({ isRepostAnimating })} />
      cells.push(
        <span
          className="PostTool RepostTool"
          data-count={postRepostsCount}
          key={`RepostTool_${post.id}`}
        >
          <button
            className={classNames({ hasPostToolDrawer: postRepostsCount > 0 })}
            onClick={!isOwnPost ? this.onClickRepostPost : null}
            style={{ pointerEvents: isOwnPost || postReposted ? 'none' : null }}
          >
            {repostIcon}
            <Hint>Repost</Hint>
          </button>
          <button className="PostToolDrawerButton" onClick={this.onClickToggleReposters}>
            <span className="PostToolValue" >
              {numberToHuman(postRepostsCount, false)}
            </span>
            <Hint className="RepostedByHint">Reposted by</Hint>
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
          <button onClick={this.onClickSharePost}>
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
            <button onClick={this.onClickEditPost}>
              <PencilIcon />
              <Hint>Edit</Hint>
            </button>
          </span>
        )
        cells.push(
          <span className="PostTool DeleteTool ShyTool" key={`DeleteTool_${post.id}`}>
            <button onClick={this.onClickDeletePost}>
              <XBoxIcon />
              <Hint>Delete</Hint>
            </button>
          </span>
        )
      } else {
        cells.push(
          <span className="PostTool FlagTool ShyTool" key={`FlagTool_${post.id}`}>
            <button onClick={this.onClickFlagPost}>
              <FlagIcon />
              <Hint>Flag</Hint>
            </button>
          </span>
        )
      }
    }
    return cells
  }

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  signUp = () => {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'isDecapitated'))
    dispatch(trackEvent('open-registration-request-post-tools'))
  }

  render() {
    const { post, isCommentsRequesting } = this.props
    if (!post) { return null }
    const classes = classNames(
      'PostTools',
      { isCommentsRequesting },
      { isCommentsActive: this.state.isCommentsActive },
    )
    return (
      <footer className={classes}>
        {this.getToolCells()}
      </footer>
    )
  }
}

const mapStateToProps = ({ authentication, gui, json, profile, routing, stream }, ownProps) => {
  const post = json[POSTS][ownProps.post.id]
  const isCommentsRequesting = stream.type === LOAD_STREAM_REQUEST &&
                               stream.meta.mappingType === COMMENTS &&
                               (`${stream.payload.postIdOrToken}` === `${ownProps.post.id}` ||
                                `${stream.payload.postIdOrToken}` === `${ownProps.post.token}`)
  return {
    isCommentsRequesting,
    isLoggedIn: authentication.isLoggedIn,
    isOwnPost: profile && `${ownProps.post.authorId}` === `${profile.id}`,
    pathname: routing.location.pathname,
    previousPath: routing.previousPath,
    postCommentsCount: post.commentsCount,
    postLoved: post.loved,
    postLovesCount: post.lovesCount,
    postReposted: post.reposted,
    postRepostsCount: post.repostsCount,
    postShowComments: post.showComments,
    postShowLovers: post.showLovers,
    postShowReposters: post.showReposters,
    postViewsCountRounded: post.viewsCountRounded,
    deviceSize: gui.deviceSize,
  }
}

export default connect(mapStateToProps)(PostTools)

