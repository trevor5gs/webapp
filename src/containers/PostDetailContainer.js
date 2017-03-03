import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { POST } from '../constants/action_types'
import { scrollToSelector } from '../lib/jello'
import { selectParamsToken, selectParamsUsername } from '../selectors/params'
import { selectPost, selectPostAuthor, selectPostHasRelatedButton, selectPostIsEmpty, selectPropsLocationStateFrom } from '../selectors/post'
import { selectStreamType } from '../selectors/stream'
import { loadComments, loadPostDetail } from '../actions/posts'
import { ErrorState4xx } from '../components/errors/Errors'
import { Paginator } from '../components/streams/Paginator'
import { PostDetail, PostDetailError } from '../components/views/PostDetail'
import { postLovers, postReposters } from '../networking/api'
import { loadUserDrawer } from '../actions/user'

function mapStateToProps(state, props) {
  return {
    author: selectPostAuthor(state, props),
    hasRelatedPostsButton: selectPostHasRelatedButton(state, props),
    isPostEmpty: selectPostIsEmpty(state, props),
    locationStateFrom: selectPropsLocationStateFrom(state, props),
    paramsToken: selectParamsToken(state, props),
    paramsUsername: selectParamsUsername(state, props),
    post: selectPost(state, props),
    streamType: selectStreamType(state),
  }
}

class PostDetailContainer extends Component {

  static propTypes = {
    author: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    hasRelatedPostsButton: PropTypes.bool.isRequired,
    isPostEmpty: PropTypes.bool.isRequired,
    locationStateFrom: PropTypes.string,
    post: PropTypes.object,
    paramsToken: PropTypes.string.isRequired,
    paramsUsername: PropTypes.string.isRequired,
    streamType: PropTypes.string, // eslint-disable-line
  }

  static defaultProps = {
    author: null,
    locationStateFrom: null,
    post: null,
    streamType: null,
  }

  static childContextTypes = {
    onClickDetailTab: PropTypes.func.isRequired,
    onClickScrollToRelatedPosts: PropTypes.func.isRequired,
  }

  static preRender = (store, routerState) => {
    const params = routerState.params
    return store.dispatch(loadPostDetail(`~${params.token}`, `~${params.username}`))
  }

  getChildContext() {
    return {
      onClickDetailTab: this.onClickDetailTab,
      onClickScrollToRelatedPosts: this.onClickScrollToRelatedPosts,
    }
  }

  componentWillMount() {
    const { dispatch, paramsToken, paramsUsername, post, isPostEmpty } = this.props
    if (!isPostEmpty) {
      this.lovesWasOpen = post.get('showLovers')
      this.repostsWasOpen = post.get('showReposters')
    }
    this.state = { activeType: 'comments', renderType: POST.DETAIL_REQUEST }
    dispatch(loadPostDetail(`~${paramsToken}`, `~${paramsUsername}`))
  }

  componentDidMount() {
    if (this.props.locationStateFrom === 'PaginatorLink') {
      requestAnimationFrame(() => {
        scrollToSelector('.TabListStreamContainer', { boundary: 'bottom', offset: 200 })
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, paramsToken, paramsUsername } = this.props
    if (paramsToken !== nextProps.paramsToken || paramsUsername !== nextProps.paramsUsername) {
      dispatch(loadPostDetail(`~${nextProps.paramsToken}`, `~${nextProps.paramsUsername}`))
    }
    switch (nextProps.streamType) {
      case POST.DETAIL_FAILURE:
      case POST.DETAIL_REQUEST:
      case POST.DETAIL_SUCCESS:
        this.setState({ renderType: nextProps.streamType })
        break
      default:
        break
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.author || !nextProps.post) { return false }
    return !Immutable.is(nextProps.post, this.props.post) ||
      ['hasRelatedPostsButton', 'paramsToken', 'paramsUsername'].some(prop =>
        nextProps[prop] !== this.props[prop],
      ) ||
      ['activeType', 'renderType'].some(prop => nextState[prop] !== this.state[prop])
  }

  onClickDetailTab = (vo) => {
    if (vo.type) {
      this.setState({ activeType: vo.type })
    }
  }

  onClickScrollToRelatedPosts = () => {
    scrollToSelector('.RelatedPostsStreamContainer .Post', { boundary: 'bottom', offset: 60 })
  }

  render() {
    const { author, hasRelatedPostsButton, isPostEmpty, paramsToken, post } = this.props
    const { activeType, renderType } = this.state
    // render loading/failure if we don't have an initial post
    if (isPostEmpty) {
      if (renderType === POST.DETAIL_REQUEST) {
        return (
          <section className="StreamContainer">
            <Paginator className="isBusy" />
          </section>
        )
      } else if (renderType === POST.DETAIL_FAILURE) {
        return (
          <PostDetailError>
            <ErrorState4xx />
          </PostDetailError>
        )
      }
      return null
    }
    const postId = post.get('id')
    let streamAction
    switch (activeType) {
      case 'loves':
        streamAction = loadUserDrawer(postLovers(postId), postId, activeType)
        break
      case 'reposts':
        streamAction = loadUserDrawer(postReposters(postId), postId, activeType)
        break
      default:
        streamAction = author && author.get('hasCommentingEnabled') ? loadComments(post.get('id'), false) : null
        break
    }
    const props = {
      activeType,
      author,
      hasEditor: author && author.get('hasCommentingEnabled') && !(post.get('isReposting') || post.get('isEditing')),
      hasRelatedPostsButton,
      key: `postDetail_${paramsToken}`,
      post,
      streamAction,
    }
    return <PostDetail {...props} />
  }
}

export default connect(mapStateToProps)(PostDetailContainer)

