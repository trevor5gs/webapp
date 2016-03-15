import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { findModel } from '../../components/base/json_helper'
import { loadComments, loadPostDetail } from '../../actions/posts'
import { postLovers, postReposters } from '../../networking/api'
import { PostDetailHelmet } from '../../components/helmets/PostDetailHelmet'
import { HeartIcon, RepostIcon } from '../../components/posts/PostIcons'
import PostParser from '../../components/parsers/PostParser'
import UserAvatars from '../../components/users/UserAvatars'
import Editor from '../../components/editor/Editor'
import StreamComponent from '../../components/streams/StreamComponent'

export function postLoversDrawer(post) {
  return (
    <UserAvatars
      endpoint={ postLovers(post.id) }
      icon={ <HeartIcon /> }
      key={ `userAvatarsLovers_${post.id}` }
      post={ post }
      resultType="love"
    />
  )
}

export function postRepostersDrawer(post) {
  return (
    <UserAvatars
      endpoint={ postReposters(post.id) }
      icon={ <RepostIcon /> }
      key={ `userAvatarsReposters_${post.id}` }
      post={ post }
      resultType="repost"
    />
  )
}

class PostDetail extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    json: PropTypes.object.isRequired,
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }

  static preRender = (store, routerState) =>
    store.dispatch(loadPostDetail(`~${routerState.params.token}`))

  componentWillMount() {
    const { dispatch, params } = this.props
    dispatch(loadPostDetail(`~${params.token}`))
  }

  render() {
    const { json, params } = this.props
    const post = findModel(json, {
      collection: MAPPING_TYPES.POSTS,
      findObj: { token: params.token },
    })
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
      if (Number(post.lovesCount) > 0) {
        postEls.push(postLoversDrawer(post))
      }
      if (Number(post.repostsCount) > 0) {
        postEls.push(postRepostersDrawer(post))
      }
      postEls.push(<Editor key={ `editor_${post.id}` } post={ post } isComment />)
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
            <StreamComponent
              action={ loadComments((post ? `${post.id}` : `~${params.token}`), false) }
              className="CommentStreamComponent"
              key={ params.token }
            />
          </article>
        </div>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    json: state.json,
    isLoggedIn: state.authentication.isLoggedIn,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(PostDetail)

