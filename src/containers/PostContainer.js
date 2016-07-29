import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { get, isEqual, pick } from 'lodash'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { getLinkObject } from '../helpers/json_helper'
import { setAssets } from '../components/parsers/RegionParser'
import Editor from '../components/editor/Editor'
import {
  categoryHeader,
  commentStream,
  header,
  parsePostBody,
  postLoversDrawer,
  postRepostersDrawer,
  repostHeader,
} from '../components/parsers/PostParser'

export function shouldContainerUpdate(thisProps, nextProps) {
  if (!nextProps.post) { return false }
  const pickProps = ['isEditing', 'isReposting', 'showComments',
                     'showLovers', 'showReposters', 'showEditor']
  const pickPosts = ['summary', 'content', 'repostContent', 'body']
  const thisCompare = { ...pick(thisProps.post, pickPosts), ...pick(thisProps, pickProps) }
  const nextCompare = { ...pick(nextProps.post, pickPosts), ...pick(nextProps, pickProps) }
  return !isEqual(thisCompare, nextCompare)
}

export function mapStateToProps(state, props) {
  const { json, profile: currentUser, routing: { location: { pathname } } } = state
  const post = json[MAPPING_TYPES.POSTS][props.post.id]
  const author = json[MAPPING_TYPES.USERS][post.authorId]
  const assets = json.assets
  const categories = post.links.categories
  const category = get(json, ['categories', categories ? categories[0] : null])
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

  let newProps = {
    assets,
    author,
    categoryName: category ? category.name : null,
    categoryPath: category ? `/discover/${category.slug}` : null,
    commentsCount: post.commentsCount,
    contentWarning: post.contentWarning,
    currentUser,
    isOnFeaturedCategory,
    isRepost,
    isReposting,
    showCommentEditor,
    showComments,
    showEditor,
    showLovers: !showEditor && !props.isGridLayout && post.showLovers && lovesCount > 0,
    showReposters: !showEditor && !props.isGridLayout && post.showReposters && repostsCount > 0,
    postBody,
    post,
  }

  if (isRepost) {
    newProps = {
      ...newProps,
      authorLinkObject: post.repostAuthor || getLinkObject(post, 'repostAuthor', json) || author,
      sourceLinkObject: getLinkObject(post, 'repostedSource', json),
    }
  }

  return newProps
}

class PostContainer extends Component {
  static propTypes = {
    assets: PropTypes.any,
    author: PropTypes.object,
    authorLinkObject: PropTypes.object,
    categoryName: PropTypes.string,
    categoryPath: PropTypes.string,
    contentWarning: PropTypes.string,
    currentUser: PropTypes.object,
    isGridLayout: PropTypes.bool,
    isOnFeaturedCategory: PropTypes.bool,
    isRepost: PropTypes.bool,
    isReposting: PropTypes.bool,
    post: PropTypes.object,
    postBody: PropTypes.array,
    showCommentEditor: PropTypes.bool,
    showComments: PropTypes.bool,
    showEditor: PropTypes.bool,
    showLovers: PropTypes.bool,
    showReposters: PropTypes.bool,
    sourceLinkObject: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return shouldContainerUpdate(this.props, nextProps)
  }

  render() {
    const {
      assets,
      author,
      categoryName,
      categoryPath,
      contentWarning,
      currentUser,
      isGridLayout,
      isOnFeaturedCategory,
      isRepost,
      isReposting,
      post,
      postBody,
      showCommentEditor,
      showComments,
      showEditor,
      showLovers,
      showReposters,
    } = this.props
    if (!post) { return null }
    setAssets(assets)

    let postHeader
    if (isRepost) {
      const { authorLinkObject, sourceLinkObject } = this.props
      postHeader = repostHeader(post, authorLinkObject, sourceLinkObject, author)
    } else if (isOnFeaturedCategory && categoryName && categoryPath) {
      postHeader = categoryHeader(post, author, categoryName, categoryPath)
    } else {
      postHeader = header(post, author)
    }

    const isRepostAnimating = isReposting && !postBody
    return (
      <div className="Post">
        {postHeader}
        {showEditor ?
          <Editor post={post} /> :
          parsePostBody(post, author, currentUser, isGridLayout, isRepostAnimating, contentWarning)
        }
        {showLovers ? postLoversDrawer(post) : null}
        {showReposters ? postRepostersDrawer(post) : null}
        {showCommentEditor ? <Editor post={post} isComment /> : null}
        {
          showComments ?
            commentStream(post, author, currentUser) :
            null
        }
      </div>)
  }
}

export default connect(mapStateToProps)(PostContainer)

