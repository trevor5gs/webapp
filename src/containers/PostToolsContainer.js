import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push, replace } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import shallowCompare from 'react-addons-shallow-compare'
import { set } from 'lodash'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { selectDeviceSize } from '../selectors/gui'
import * as postActions from '../actions/posts'
import { trackEvent } from '../actions/analytics'
import { openModal, closeModal } from '../actions/modals'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import FlagDialog from '../components/dialogs/FlagDialog'
import RegistrationRequestDialog from '../components/dialogs/RegistrationRequestDialog'
import ShareDialog from '../components/dialogs/ShareDialog'
import { PostTools } from '../components/posts/PostTools'

export function mapStateToProps(state, props) {
  const { authentication, json, profile, routing, stream } = state
  const post = json[MAPPING_TYPES.POSTS][props.post.id]
  const isCommentsRequesting = stream.type === ACTION_TYPES.LOAD_STREAM_REQUEST &&
                               stream.meta.mappingType === MAPPING_TYPES.COMMENTS &&
                               (`${stream.payload.postIdOrToken}` === `${props.post.id}` ||
                                `${stream.payload.postIdOrToken}` === `${props.post.token}`)
  return {
    detailLink: `/${props.author.username}/post/${post.token}`,
    deviceSize: selectDeviceSize(state),
    isCommentsRequesting,
    isLoggedIn: authentication.isLoggedIn,
    isOwnPost: profile && `${props.post.authorId}` === `${profile.id}`,
    pathname: routing.location.pathname,
    postCommentsCount: post.commentsCount,
    postLoved: post.loved,
    postLovesCount: post.lovesCount,
    postReposted: post.reposted,
    postRepostsCount: post.repostsCount,
    postShowComments: post.showComments,
    postShowLovers: post.showLovers,
    postShowReposters: post.showReposters,
    postViewsCountRounded: post.viewsCountRounded,
    previousPath: routing.previousPath,
  }
}

class PostToolsContainer extends Component {

  static propTypes = {
    author: PropTypes.object.isRequired,
    deviceSize: PropTypes.string,
    detailLink: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isCommentsRequesting: PropTypes.bool,
    isGridMode: PropTypes.bool,
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onClickToggleComments = () => {
    const { detailLink, dispatch, isLoggedIn, post, postShowComments } = this.props
    if (isLoggedIn) {
      const nextShowComments = !postShowComments
      this.setState({ isCommentsActive: nextShowComments })
      dispatch(postActions.toggleComments(post, nextShowComments))
    } else {
      dispatch(push(detailLink))
    }
  }

  onClickLovePost = () => {
    const { dispatch, isLoggedIn, post, postLoved } = this.props
    if (!isLoggedIn) {
      this.onSignUp()
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
    const { detailLink, dispatch, isGridMode, isLoggedIn,
            pathname, post, postShowLovers } = this.props
    if (!isLoggedIn) {
      this.onSignUp()
      return
    }
    if (isGridMode && pathname !== detailLink) {
      dispatch(push(detailLink))
    } else {
      const showLovers = !postShowLovers
      dispatch(postActions.toggleLovers(post, showLovers))
    }
  }

  onClickToggleReposters = () => {
    const { detailLink, dispatch, isGridMode, isLoggedIn,
      pathname, post, postShowReposters } = this.props
    if (!isLoggedIn) {
      this.onSignUp()
      return
    }
    if (isGridMode && pathname !== detailLink) {
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
        onConfirm={this.onCloseModal}
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
      this.onSignUp()
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
        onDismiss={this.onCloseModal}
      />))
  }

  onCofirmDeletePost = () => {
    const { dispatch, pathname, post, previousPath } = this.props
    this.onCloseModal()
    const action = postActions.deletePost(post)
    if (pathname.match(post.token)) {
      set(action, 'meta.successAction', replace(previousPath || '/'))
    }
    dispatch(action)
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onSignUp = () => {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'asDecapitated'))
    dispatch(trackEvent('open-registration-request-post-tools'))
  }

  render() {
    const toolProps = {
      ...this.props,
      isCommentsActive: this.state.isCommentsActive,
      onClickDeletePost: this.onClickDeletePost,
      onClickEditPost: this.onClickEditPost,
      onClickFlagPost: this.onClickFlagPost,
      onClickLovePost: this.onClickLovePost,
      onClickRepostPost: this.onClickRepostPost,
      onClickSharePost: this.onClickSharePost,
      onClickToggleComments: this.onClickToggleComments,
      onClickToggleLovers: this.onClickToggleLovers,
      onClickToggleReposters: this.onClickToggleReposters,
    }
    return <PostTools {...toolProps} />
  }
}

export default connect(mapStateToProps)(PostToolsContainer)

