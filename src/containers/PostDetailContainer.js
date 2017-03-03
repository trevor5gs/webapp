import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { POST } from '../constants/action_types'
import { scrollToSelector } from '../lib/jello'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectParamsToken, selectParamsUsername } from '../selectors/params'
import { selectPost, selectPostAuthor, selectPostIsEmpty, selectPropsLocationStateFrom } from '../selectors/post'
import { selectStreamType } from '../selectors/stream'
import { loadComments, loadPostDetail, toggleLovers, toggleReposters } from '../actions/posts'
import { ErrorState4xx } from '../components/errors/Errors'
import { Paginator } from '../components/streams/Paginator'
import { PostDetail, PostDetailError } from '../components/views/PostDetail'

export function shouldContainerUpdate(thisProps, nextProps, thisState, nextState) {
  if (!nextProps.author || !nextProps.post) { return false }
  return !Immutable.is(nextProps.post, thisProps.post) ||
    ['isLoggedIn', 'paramsToken', 'paramsUsername'].some(prop =>
      nextProps[prop] !== thisProps[prop],
    ) ||
    ['renderType'].some(prop => nextState[prop] !== thisState[prop])
}

export function mapStateToProps(state, props) {
  return {
    author: selectPostAuthor(state, props),
    isLoggedIn: selectIsLoggedIn(state),
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
    isLoggedIn: PropTypes.bool.isRequired,
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

  static preRender = (store, routerState) => {
    const params = routerState.params
    return store.dispatch(loadPostDetail(`~${params.token}`, `~${params.username}`))
  }

  componentWillMount() {
    const { dispatch, paramsToken, paramsUsername, post, isPostEmpty } = this.props
    if (!isPostEmpty) {
      this.lovesWasOpen = post.get('showLovers')
      this.repostsWasOpen = post.get('showReposters')
    }
    this.state = { renderType: POST.DETAIL_REQUEST }
    dispatch(loadPostDetail(`~${paramsToken}`, `~${paramsUsername}`))
  }

  componentDidMount() {
    if (this.props.locationStateFrom === 'PaginatorLink') {
      requestAnimationFrame(() => {
        scrollToSelector('.CommentStreamContainer')
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
    return shouldContainerUpdate(this.props, nextProps, this.state, nextState)
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
    const { author, isPostEmpty, paramsToken, post } = this.props
    const { renderType } = this.state
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
      author,
      hasEditor: author && author.get('hasCommentingEnabled') && !(post.get('isReposting') || post.get('isEditing')),
      key: `postDetail_${paramsToken}`,
      post,
      streamAction: author && author.get('hasCommentingEnabled') ? loadComments(post.get('id'), false) : null,
    }
    return <PostDetail {...props} />
  }
}

export default connect(mapStateToProps)(PostDetailContainer)

