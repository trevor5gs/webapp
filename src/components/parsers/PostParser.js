import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { getLinkObject } from '../../helpers/json_helper'
import { body, repostedBody, setModels } from './RegionParser'
import Avatar from '../assets/Avatar'
import UserAvatars from '../../components/users/UserAvatars'
import ContentWarningButton from '../posts/ContentWarningButton'
import PostTools from '../posts/PostTools'
import CommentStream from '../streams/CommentStream'
import { HeartIcon, RepostIcon } from '../posts/PostIcons'
import RelationsGroup from '../relationships/RelationsGroup'
import Editor from '../../components/editor/Editor'
import { postLovers, postReposters } from '../../networking/api'

function getPostDetailPath(author, post) {
  return `/${author.username}/post/${post.token}`
}

function postLoversDrawer(post) {
  return (
    <UserAvatars
      endpoint={postLovers(post.id)}
      icon={<HeartIcon />}
      key={`userAvatarsLovers_${post.id}${post.lovesCount}`}
      post={post}
      resultType="love"
    />
  )
}

function postRepostersDrawer(post) {
  return (
    <UserAvatars
      endpoint={postReposters(post.id)}
      icon={<RepostIcon />}
      key={`userAvatarsReposters_${post.id}${post.repostsCount}`}
      post={post}
      resultType="repost"
    />
  )
}

function commentStream(post, author) {
  return (
    <CommentStream
      key={`commentStream_${post.id}${post.commentsCount}`}
      post={post}
      author={author}
    />
  )
}

const PostHeaderTimeAgoLink = ({ to, createdAt }) =>
  <Link className="PostHeaderTimeAgoLink" to={to}>
    <span>{new Date(createdAt).timeAgoInWords()}</span>
  </Link>

PostHeaderTimeAgoLink.propTypes = {
  createdAt: PropTypes.string,
  to: PropTypes.string,
}


function header(post, author) {
  if (!post || !author) { return null }
  const postDetailPath = getPostDetailPath(author, post)
  return (
    <header className="PostHeader" key={`PostHeader_${post.id}`}>
      <div className="PostHeaderAuthor">
        <Link className="PostHeaderLink" to={`/${author.username}`}>
          <Avatar
            priority={author.relationshipPriority}
            sources={author.avatar}
            userId={`${author.id}`}
            username={author.username}
          />
          <span
            className="DraggableUsername"
            data-priority={author.relationshipPriority || 'inactive'}
            data-userid={author.id}
            data-username={author.username}
            draggable
          >
            {`@${author.username}`}
          </span>
        </Link>
      </div>
      <RelationsGroup user={author} classList="inHeader" />
      <PostHeaderTimeAgoLink to={postDetailPath} createdAt={post.createdAt} />
    </header>
  )
}

function categoryHeader(post, author, categoryName, categoryPath) {
  if (!post || !author) { return null }
  const postDetailPath = getPostDetailPath(author, post)
  return (
    <header className="CategoryHeader" key={`CategoryHeader_${post.id}`}>
      <div className="CategoryHeaderAuthor">
        <Link className="PostHeaderLink" to={`/${author.username}`}>
          <Avatar
            priority={author.relationshipPriority}
            sources={author.avatar}
            userId={`${author.id}`}
            username={author.username}
          />
          <span
            className="DraggableUsername"
            data-priority={author.relationshipPriority || 'inactive'}
            data-userid={author.id}
            data-username={author.username}
            draggable
          >
            {`@${author.username}`}
          </span>
        </Link>
      </div>
      <RelationsGroup user={author} classList="inHeader" />
      <div className="CategoryHeaderCategory">
        <Link className="PostHeaderLink" to={categoryPath}>
          <span>in </span>
          <span className="CategoryHeaderCategoryName">{categoryName}</span>
        </Link>
      </div>
      <PostHeaderTimeAgoLink to={postDetailPath} createdAt={post.createdAt} />
    </header>
  )
}

function repostHeader(post, repostAuthor, repostSource, repostedBy) {
  if (!post || !repostedBy) { return null }
  const postDetailPath = getPostDetailPath(repostAuthor, post)
  return (
    <header className="RepostHeader" key={`RepostHeader_${post.id}`}>
      <div className="RepostHeaderAuthor">
        <Link className="PostHeaderLink" to={`/${repostAuthor.username}`}>
          <Avatar
            priority={repostAuthor.relationshipPriority}
            sources={repostAuthor.avatar}
            userId={`${repostAuthor.id}`}
            username={repostAuthor.username}
          />
          <span
            className="DraggableUsername"
            data-priority={repostAuthor.relationshipPriority || 'inactive'}
            data-userid={repostAuthor.id}
            data-username={repostAuthor.username}
            draggable
          >
            {`@${repostAuthor.username}`}
          </span>
        </Link>
      </div>
      <RelationsGroup user={repostAuthor} classList="inHeader" />
      <div className="RepostHeaderReposter">
        <Link className="PostHeaderLink" to={`/${repostedBy.username}`}>
          <RepostIcon />
          <span
            className="DraggableUsername"
            data-priority={repostedBy.relationshipPriority || 'inactive'}
            data-userid={repostedBy.id}
            data-username={repostedBy.username}
            draggable
          >
            {` by @${repostedBy.username}`}
          </span>
        </Link>
      </div>
      <PostHeaderTimeAgoLink to={postDetailPath} createdAt={post.createdAt} />
    </header>
  )
}

function footer(post, author, currentUser, isGridLayout, isRepostAnimating) {
  if (!author) { return null }
  return (
    <PostTools
      author={author}
      post={post}
      isGridLayout={isGridLayout}
      isRepostAnimating={isRepostAnimating}
      key={`PostTools_${post.id}`}
    />
  )
}

export function parsePost(post, author, currentUser,
  isGridLayout = true, isRepostAnimating = false, contentWarning = null,
) {
  if (!post) { return null }
  const cells = []
  const postDetailPath = getPostDetailPath(author, post)

  if (contentWarning) {
    cells.push(<ContentWarningButton key={`contentWarning_${post.id}`} post={post} />)
  }

  if (post.repostContent && post.repostContent.length) {
    // this is weird, but the post summary is
    // actually the repost summary on reposts
    if (isGridLayout) {
      cells.push(body(post.summary, post.id, isGridLayout, postDetailPath))
    } else {
      cells.push(body(post.repostContent, `repost_${post.id}`, isGridLayout, postDetailPath))
      if (post.content && post.content.length) {
        cells.push(repostedBody(author, post.content, post.id, isGridLayout, postDetailPath))
      }
    }
  } else {
    const content = isGridLayout ? post.summary : post.content
    cells.push(body(content, post.id, isGridLayout, postDetailPath))
  }
  cells.push(footer(post, author, currentUser, isGridLayout, isRepostAnimating))
  setModels({})
  return cells
}

function isRepost(post) {
  return post.repostContent && post.repostContent.length
}

/* eslint-disable react/prefer-stateless-function */
class PostParser extends Component {
  static propTypes = {
    assets: PropTypes.any,
    author: PropTypes.object,
    authorLinkObject: PropTypes.object,
    categoryName: PropTypes.string,
    categoryPath: PropTypes.string,
    commentsCount: PropTypes.number,
    contentWarning: PropTypes.string,
    currentUser: PropTypes.object,
    isEditing: PropTypes.bool,
    isGridLayout: PropTypes.bool,
    isOnFeaturedCategory: PropTypes.bool,
    isPostDetail: PropTypes.bool,
    isReposting: PropTypes.bool,
    lovesCount: PropTypes.number,
    repostsCount: PropTypes.number,
    post: PropTypes.object,
    postBody: PropTypes.array,
    showComments: PropTypes.bool,
    showLovers: PropTypes.bool,
    showReposters: PropTypes.bool,
    sourceLinkObject: PropTypes.object,
  }

  render() {
    const {
      assets,
      author,
      categoryName,
      categoryPath,
      commentsCount,
      contentWarning,
      currentUser,
      isEditing,
      isGridLayout,
      isOnFeaturedCategory,
      isPostDetail,
      isReposting,
      lovesCount,
      post,
      postBody,
      repostsCount,
      showComments,
      showLovers,
      showReposters,
    } = this.props
    if (!post) { return null }
    setModels({ assets })

    const showEditor = (isEditing || isReposting) && postBody
    const reallyShowLovers = !showEditor && !isGridLayout && showLovers && lovesCount > 0
    const reallyShowReposters = !showEditor && !isGridLayout && showReposters && repostsCount > 0
    const reallyShowComments = !showEditor && !isPostDetail && showComments

    let postHeader
    if (isRepost(post)) {
      const { authorLinkObject, sourceLinkObject } = this.props
      postHeader = repostHeader(post, authorLinkObject, sourceLinkObject, author)
    } else if (isOnFeaturedCategory && categoryName && categoryPath) {
      console.log('render category header')
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
          parsePost(post, author, currentUser, isGridLayout, isRepostAnimating, contentWarning)}
        {reallyShowLovers ? postLoversDrawer(post) : null}
        {reallyShowReposters ? postRepostersDrawer(post) : null}
        {reallyShowComments ? <Editor post={post} isComment /> : null}
        {
          reallyShowComments && commentsCount > 0 ?
            commentStream(post, author, currentUser) :
            null
        }
      </div>)
  }
}

const mapStateToProps = (state, ownProps) => {
  const { json, profile: currentUser, routing: { location: { pathname } } } = state
  const post = json[MAPPING_TYPES.POSTS][ownProps.post.id]
  const author = json[MAPPING_TYPES.USERS][post.authorId]
  const assets = json.assets
  const categories = post.links.categories
  const category = categories ? json.categories[categories[0]] : null
  const isOnFeaturedCategory = /^\/(?:discover(\/featured|\/recommended)?)?$/.test(pathname)

  let newProps = {
    assets,
    author,
    categoryName: category ? category.name : null,
    categoryPath: category ? `/discover/${category.slug}` : null,
    commentsCount: post.commentsCount,
    contentWarning: post.contentWarning,
    currentUser,
    isEditing: post.isEditing || false,
    isOnFeaturedCategory,
    isReposting: post.isReposting || false,
    lovesCount: post.lovesCount,
    repostsCount: post.repostsCount,
    showComments: post.showComments || false,
    showLovers: post.showLovers || false,
    showReposters: post.showReposters || false,
    postBody: post.body,
    post,
  }

  if (isRepost(post)) {
    newProps = {
      ...newProps,
      authorLinkObject: post.repostAuthor || getLinkObject(post, 'repostAuthor', json) || author,
      sourceLinkObject: getLinkObject(post, 'repostedSource', json),
    }
  }

  return newProps
}

export default connect(mapStateToProps)(PostParser)

