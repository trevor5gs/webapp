import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { selectParamsToken, selectPost } from '../selectors'
import { loadComments, loadPostDetail, toggleLovers, toggleReposters } from '../actions/posts'
import { ErrorState4xx } from '../components/errors/Errors'
import { PostDetail, PostDetailError } from '../components/views/PostDetail'

// A lot of information needs to get generated in the meta tags for this page
// before it ever hits React's virtual DOM so it's really beneficial to
// optimzize the amount of times render is called.
export function shouldContainerUpdate(thisProps, nextProps) {
  const { author, isLoggedIn, paramsToken, post, streamError, streamType } = thisProps
  if (!nextProps.author || !nextProps.post) {
    return false
  }
  if (paramsToken !== nextProps.paramsToken || isLoggedIn !== nextProps.isLoggedIn) {
    return true
  }
  if (!isEqual(author, nextProps.author) || !isEqual(post, nextProps.post)) {
    return true
  }
  if (streamType !== nextProps.streamType || !isEqual(streamError, nextProps.streamError)) {
    return true
  }
  return false
}

export function mapStateToProps(state, props) {
  const { authentication, json, stream } = state
  const paramsToken = selectParamsToken(state, props)
  const post = selectPost(state, props)
  return {
    author: post ? json[MAPPING_TYPES.USERS][post.authorId] : null,
    isLoggedIn: authentication.isLoggedIn,
    paramsToken,
    post,
    streamError: stream.error,
    streamType: stream.type,
  }
}

export class PostDetailContainer extends Component {

  static propTypes = {
    author: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    post: PropTypes.object,
    paramsToken: PropTypes.string.isRequired,
    streamError: PropTypes.object,
    streamType: PropTypes.string,
  }

  static preRender = (store, routerState) =>
    store.dispatch(loadPostDetail(`~${routerState.params.token}`))

  componentWillMount() {
    const { dispatch, paramsToken, post } = this.props
    if (post) {
      this.lovesWasOpen = post.showLovers
      this.repostsWasOpen = post.showReposters
    }
    dispatch(loadPostDetail(`~${paramsToken}`))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, paramsToken } = this.props
    if (paramsToken !== nextProps.paramsToken) {
      dispatch(loadPostDetail(`~${nextProps.paramsToken}`))
    }
  }

  shouldComponentUpdate(nextProps) {
    return shouldContainerUpdate(this.props, nextProps)
  }

  componentWillUnmount() {
    const { dispatch, isLoggedIn, post } = this.props
    // this prevents the lover/reposters from firing since logout clears the json store
    if (!isLoggedIn) { return }
    if (!this.lovesWasOpen) {
      dispatch(toggleLovers(post, false))
    }
    if (!this.repostsWasOpen) {
      dispatch(toggleReposters(post, false))
    }
  }

  render() {
    const { author, paramsToken, post, streamError, streamType } = this.props
    if (streamType === ACTION_TYPES.POST.DETAIL_FAILURE && streamError && !post) {
      return (
        <PostDetailError>
          <ErrorState4xx />
        </PostDetailError>
      )
    }
    const props = {
      author,
      hasEditor: author && author.hasCommentingEnabled && !(post.isReposting || post.isEditing),
      key: `postDetail_${paramsToken}`,
      post,
      streamAction: author && author.hasCommentingEnabled ? loadComments(post, false) : null,
    }
    return <PostDetail {...props} />
  }
}

export default connect(mapStateToProps)(PostDetailContainer)

