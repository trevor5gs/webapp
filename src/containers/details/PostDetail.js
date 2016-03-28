import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { findModel } from '../../components/base/json_helper'
import { loadComments, loadPostDetail, toggleLovers, toggleReposters } from '../../actions/posts'
import { PostDetailHelmet } from '../../components/helmets/PostDetailHelmet'
import { ErrorState4xx } from '../../components/errors/Errors'
import PostParser from '../../components/parsers/PostParser'
import Editor from '../../components/editor/Editor'
import StreamComponent from '../../components/streams/StreamComponent'

class PostDetail extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    json: PropTypes.object.isRequired,
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    stream: PropTypes.shape({
      type: PropTypes.string,
      error: PropTypes.object,
    }),
  }

  static preRender = (store, routerState) =>
    store.dispatch(loadPostDetail(`~${routerState.params.token}`))

  componentWillMount() {
    const { dispatch, json, params } = this.props
    this.initPost = findModel(json, {
      collection: MAPPING_TYPES.POSTS,
      findObj: { token: params.token },
    })
    if (this.initPost) {
      this.lovesWasOpen = this.initPost.showLovers
      this.repostsWasOpen = this.initPost.showReposters
    }
    dispatch(loadPostDetail(`~${params.token}`))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params } = this.props
    if (params.token !== nextProps.params.token) {
      dispatch(loadPostDetail(`~${nextProps.params.token}`))
    }
  }

  componentWillUnmount() {
    const { dispatch, json, params } = this.props
    const post = findModel(json, {
      collection: MAPPING_TYPES.POSTS,
      findObj: { token: params.token },
    })
    if (!this.lovesWasOpen) {
      dispatch(toggleLovers(post, false))
    }
    if (!this.repostsWasOpen) {
      dispatch(toggleReposters(post, false))
    }
  }

  getPost() {
    const { json, params } = this.props
    return findModel(json, {
      collection: MAPPING_TYPES.POSTS,
      findObj: { token: params.token.toLowerCase() },
    })
  }

  render() {
    const { json, params, stream } = this.props
    const post = this.getPost()
    switch (stream.type) {
      case ACTION_TYPES.POST.DETAIL_FAILURE:
        if (!post && stream.error) {
          return (
            <section className="Panel">
              <section className="StreamComponent hasErrored">
                <ErrorState4xx />
              </section>
            </section>
          )
        }
        break
      default:
        break
    }
    const postEls = []
    let author
    if (post) {
      author = json[MAPPING_TYPES.USERS][post.authorId]
      postEls.push(
        <PostParser
          isGridLayout={ false }
          isPostDetail
          key={ `postParser_${post.id}` }
          post={ post }
        />
      )
      if (author && author.hasCommentingEnabled) {
        postEls.push(<Editor key={ `editor_${post.id}` } post={ post } isComment />)
      }
    }
    return (
      <section className="PostDetail Panel">
        { post && author ? <PostDetailHelmet post={ post } author={ author } /> : null }
        <div className="PostDetails Posts asList">
          <article
            id={ `Post_${post ? post.id : null}` }
            key={ `postDetail_${post ? post.id : null}` }
            className="PostList"
          >
            <div className="StreamContainer">
              { postEls }
            </div>
            {
              post && author && author.hasCommentingEnabled ?
                <StreamComponent
                  action={ loadComments((post ? `${post.id}` : `~${params.token}`), false) }
                  className="CommentStreamComponent"
                  key={ params.token }
                /> :
                null
            }
          </article>
        </div>
      </section>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { json } = state
  const { params } = ownProps
  const post = findModel(json, {
    collection: MAPPING_TYPES.POSTS,
    findObj: { token: params.token.toLowerCase() },
  })
  return {
    token: post ? post.token : null,
    json: state.json,
    isLoggedIn: state.authentication.isLoggedIn,
    stream: state.stream,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(PostDetail)

