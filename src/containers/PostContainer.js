import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import shallowCompare from 'react-addons-shallow-compare'
import { get } from 'lodash'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectColumnWidth,
  selectCommentOffset,
  selectContentWidth,
  selectInnerHeight,
  selectIsMobile,
  selectIsGridMode,
} from '../selectors/gui'
import { selectPostFromPropsPostId } from '../selectors/post'
import { getLinkObject } from '../helpers/json_helper'
import { trackEvent } from '../actions/analytics'
import { watchPost, unwatchPost } from '../actions/posts'
import { openModal } from '../actions/modals'
import RegistrationRequestDialog from '../components/dialogs/RegistrationRequestDialog'
import Editor from '../components/editor/Editor'
import {
  CategoryHeader,
  CommentStream,
  PostBody,
  PostFooter,
  PostHeader,
  PostLoversDrawer,
  PostRepostersDrawer,
  RepostHeader,
} from '../components/posts/PostRenderables'
import { WatchTool } from '../components/posts/PostTools'

export function mapStateToProps(state, props) {
  const { json, routing: { location: { pathname } } } = state
  const post = selectPostFromPropsPostId(state, props)
  const author = json[MAPPING_TYPES.USERS][post.authorId]
  const assets = json.assets
  const categories = post.links.categories
  const category = get(json, ['categories', categories ? categories[0] : null])
  const isLoggedIn = selectIsLoggedIn(state)
  const isOnFeaturedCategory = /^\/(?:discover(\/featured|\/recommended)?)?$/.test(pathname)
  const isRepost = !!(post.repostContent && post.repostContent.length)
  const isEditing = post.isEditing || false
  const isReposting = post.isReposting || false
  const postBody = post.body
  const showEditor = !!((isEditing || isReposting) && postBody)
  const lovesCount = post.lovesCount
  const repostsCount = post.repostsCount
  const showCommentEditor = !showEditor && !props.isPostDetail && post.showComments
  const showComments = showCommentEditor && post.commentsCount > 0
  const isGridMode = props.isPostDetail ? false : selectIsGridMode(state)

  let newProps = {
    assets,
    author,
    categoryName: category ? category.name : null,
    categoryPath: category ? `/discover/${category.slug}` : null,
    columnWidth: selectColumnWidth(state),
    commentOffset: selectCommentOffset(state),
    commentsCount: post.commentsCount,
    contentWarning: post.contentWarning,
    contentWidth: selectContentWidth(state),
    innerHeight: selectInnerHeight(state),
    isGridMode,
    isLoggedIn,
    isMobile: selectIsMobile(state),
    isOnFeaturedCategory,
    isRepost,
    isReposting,
    isWatchingPost: isLoggedIn && post.watching,
    post,
    postBody,
    showCommentEditor,
    showComments,
    showEditor,
    showLovers: !showEditor && !isGridMode && post.showLovers && lovesCount > 0,
    showReposters: !showEditor && !isGridMode && post.showReposters && repostsCount > 0,
  }

  if (isRepost) {
    newProps = {
      ...newProps,
      authorLinkObject: post.repostAuthor || getLinkObject(post, 'repostAuthor', json) || author,
    }
  }

  return newProps
}

class PostContainer extends Component {
  static propTypes = {
    assets: PropTypes.object,
    author: PropTypes.object,
    authorLinkObject: PropTypes.object,
    categoryName: PropTypes.string,
    categoryPath: PropTypes.string,
    columnWidth: PropTypes.number,
    commentOffset: PropTypes.number,
    contentWarning: PropTypes.string,
    contentWidth: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    innerHeight: PropTypes.number,
    isGridMode: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isMobile: PropTypes.bool,
    isOnFeaturedCategory: PropTypes.bool,
    isPostDetail: PropTypes.bool,
    isPostHeaderHidden: PropTypes.bool,
    isRepost: PropTypes.bool,
    isReposting: PropTypes.bool,
    isWatchingPost: PropTypes.bool,
    post: PropTypes.object,
    postBody: PropTypes.array,
    showCommentEditor: PropTypes.bool,
    showComments: PropTypes.bool,
    showEditor: PropTypes.bool,
    showLovers: PropTypes.bool,
    showReposters: PropTypes.bool,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onClickWatchPost = () => {
    const { dispatch, isLoggedIn, post, isWatchingPost } = this.props
    if (!isLoggedIn) {
      this.onSignUp()
      return
    }
    if (isWatchingPost) {
      dispatch(unwatchPost(post))
      dispatch(trackEvent('unwatched-post'))
    } else {
      dispatch(watchPost(post))
      dispatch(trackEvent('watched-post'))
    }
  }

  onSignUp = () => {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'asDecapitated'))
    dispatch(trackEvent('open-registration-request-post-tools'))
  }

  render() {
    const {
      assets,
      author,
      categoryName,
      categoryPath,
      columnWidth,
      commentOffset,
      contentWarning,
      contentWidth,
      innerHeight,
      isGridMode,
      isMobile,
      isOnFeaturedCategory,
      isPostDetail,
      isPostHeaderHidden,
      isRepost,
      isReposting,
      isWatchingPost,
      post,
      postBody,
      showCommentEditor,
      showComments,
      showEditor,
      showLovers,
      showReposters,
    } = this.props
    if (!post) { return null }

    let postHeader
    if (isRepost) {
      const { authorLinkObject } = this.props
      const reProps = {
        inUserDetail: isPostHeaderHidden,
        post,
        repostAuthor: authorLinkObject,
        repostedBy: author,
      }
      postHeader = <RepostHeader {...reProps} />
    } else if (isPostHeaderHidden) {
      postHeader = null
    } else if (isOnFeaturedCategory && categoryName && categoryPath) {
      const catProps = { post, author, categoryName, categoryPath }
      postHeader = <CategoryHeader {...catProps} />
    } else {
      postHeader = <PostHeader post={post} author={author} isPostDetail={isPostDetail} />
    }

    const isRepostAnimating = isReposting && !postBody
    return (
      <div className={classNames('Post', { isPostHeaderHidden: isPostHeaderHidden && !isRepost })}>
        {postHeader}
        {showEditor ?
          <Editor post={post} /> :
          <PostBody
            assets={assets}
            author={author}
            columnWidth={columnWidth}
            commentOffset={commentOffset}
            contentWarning={contentWarning}
            contentWidth={contentWidth}
            innerHeight={innerHeight}
            isGridMode={isGridMode}
            post={post}
          />
        }
        <PostFooter
          author={author}
          isGridMode={isGridMode}
          isRepostAnimating={isRepostAnimating}
          post={post}
        />
        {showLovers ? <PostLoversDrawer post={post} /> : null}
        {showReposters ? <PostRepostersDrawer post={post} /> : null}
        {isMobile ?
          <WatchTool
            isMobile
            isWatchingPost={isWatchingPost}
            onClickWatchPost={this.onClickWatchPost}
          /> : null
        }
        {showCommentEditor ? <Editor post={post} isComment /> : null}
        {showComments ? <CommentStream post={post} author={author} /> : null}
      </div>)
  }
}

export default connect(mapStateToProps)(PostContainer)

