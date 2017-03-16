import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { POST } from '../constants/action_types'
import { scrollToPosition, scrollToSelector } from '../lib/jello'
import { selectColumnCount, selectInnerHeight } from '../selectors/gui'
import { selectParamsToken, selectParamsUsername } from '../selectors/params'
import {
  selectPost,
  selectPostAuthor,
  selectPostDetailTabs,
  selectPostHasRelatedButton,
  selectPostIsEmpty,
  selectPropsLocationStateFrom,
} from '../selectors/post'
import { selectPropsLocationKey } from '../selectors/routing'
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
    columnCount: selectColumnCount(state, props),
    hasRelatedPostsButton: selectPostHasRelatedButton(state, props),
    innerHeight: selectInnerHeight(state, props),
    isPostEmpty: selectPostIsEmpty(state, props),
    locationKey: selectPropsLocationKey(state, props),
    locationStateFrom: selectPropsLocationStateFrom(state, props),
    paramsToken: selectParamsToken(state, props),
    paramsUsername: selectParamsUsername(state, props),
    post: selectPost(state, props),
    tabs: selectPostDetailTabs(state, props),
    streamType: selectStreamType(state),
  }
}

class PostDetailContainer extends Component {

  static propTypes = {
    author: PropTypes.object,
    columnCount: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasRelatedPostsButton: PropTypes.bool.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isPostEmpty: PropTypes.bool.isRequired,
    locationKey: PropTypes.string.isRequired,
    locationStateFrom: PropTypes.string,
    post: PropTypes.object,
    paramsToken: PropTypes.string.isRequired,
    paramsUsername: PropTypes.string.isRequired,
    streamType: PropTypes.string, // eslint-disable-line
    tabs: PropTypes.array.isRequired,
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
    const { dispatch, locationKey, paramsToken, paramsUsername } = this.props
    // a click on the notification post link when we are already on the post
    // should trigger the loading of additional content if it exists
    if ((paramsToken !== nextProps.paramsToken || paramsUsername !== nextProps.paramsUsername) ||
        (paramsToken === nextProps.paramsToken && locationKey !== nextProps.locationKey)) {
      // load the new detail or trigger a reload of the current
      dispatch(loadPostDetail(`~${nextProps.paramsToken}`, `~${nextProps.paramsUsername}`))
      const action = this.getStreamAction()
      if (action) { dispatch(action) }
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
    const { innerHeight } = this.props
    const el = document.querySelector('.RelatedPostsStreamContainer')
    if (!el) { return }
    const rect = el.getBoundingClientRect()
    const dy = innerHeight < rect.height ? rect.height + (innerHeight - rect.height) : rect.height
    scrollToPosition(0, window.scrollY + dy + (rect.top - innerHeight))
  }

  getStreamAction() {
    const { author, post } = this.props
    const { activeType } = this.state
    const postId = post.get('id')
    switch (activeType) {
      case 'loves':
        return loadUserDrawer(postLovers(postId), postId, activeType)
      case 'reposts':
        return loadUserDrawer(postReposters(postId), postId, activeType)
      default:
        return author && author.get('hasCommentingEnabled') ? loadComments(post.get('id'), false) : null
    }
  }

  render() {
    const {
      author,
      columnCount,
      hasRelatedPostsButton,
      isPostEmpty,
      paramsToken,
      post,
      tabs,
    } = this.props
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
    const props = {
      activeType,
      author,
      columnCount,
      hasEditor: author && author.get('hasCommentingEnabled') && !(post.get('isReposting') || post.get('isEditing')),
      hasRelatedPostsButton,
      key: `postDetail_${paramsToken}`,
      post,
      streamAction: this.getStreamAction(),
      tabs,
    }
    return <PostDetail {...props} />
  }
}

export default connect(mapStateToProps)(PostDetailContainer)

