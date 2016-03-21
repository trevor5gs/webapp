import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { getLinkObject } from '../base/json_helper'
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
      endpoint={ postLovers(post.id) }
      icon={ <HeartIcon /> }
      key={ `userAvatarsLovers_${post.id}` }
      post={ post }
      resultType="love"
    />
  )
}

function postRepostersDrawer(post) {
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

function commentStream(post, author) {
  return (
    <CommentStream
      key={ `Comments_${post.id}_${post.commentsCount}` }
      post={ post }
      author={ author }
    />
  )
}

const PostHeaderTimeAgoLink = ({ to, createdAt }) =>
  <Link className="PostHeaderTimeAgoLink" to={ to }>
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
    <header className="PostHeader" key={ `PostHeader_${post.id}` }>
      <div className="PostHeaderAuthor">
        <Link className="PostHeaderLink" to={ `/${author.username}` }>
          <Avatar sources={ author.avatar } />
          <span>{ `@${author.username}` }</span>
        </Link>
      </div>
      <RelationsGroup user={ author } classList="inHeader" />
      <PostHeaderTimeAgoLink to={ postDetailPath } createdAt={ post.createdAt } />
    </header>
  )
}

function repostHeader(post, repostAuthor, repostSource, repostedBy) {
  if (!post || !repostedBy) { return null }
  const postDetailPath = getPostDetailPath(repostAuthor, post)
  return (
    <header className="RepostHeader" key={ `RepostHeader_${post.id}` }>
      <div className="RepostHeaderAuthor">
        <Link className="PostHeaderLink" to={ `/${repostAuthor.username}` }>
          <Avatar sources={ repostAuthor.avatar } />
          <span>{ `@${repostAuthor.username}` }</span>
        </Link>
      </div>
      <RelationsGroup user={ repostAuthor } classList="inHeader" />
      <div className="RepostHeaderReposter">
        <Link className="PostHeaderLink" to={ `/${repostedBy.username}` }>
          <RepostIcon />
          { ` by @${repostedBy.username}` }
        </Link>
      </div>
      <PostHeaderTimeAgoLink to={ postDetailPath } createdAt={ post.createdAt } />
    </header>
  )
}

function footer(post, author, currentUser, isGridLayout) {
  if (!author) { return null }
  return (
    <PostTools
      author={ author }
      post={ post }
      currentUser={ currentUser }
      isGridLayout={ isGridLayout }
      key={ `PostTools_${post.id}` }
    />
  )
}

export function parsePost(post, author, currentUser, isGridLayout = true) {
  if (!post) { return null }
  const cells = []
  const postDetailPath = getPostDetailPath(author, post)

  if (post.contentWarning) {
    cells.push(<ContentWarningButton post={ post } />)
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
  cells.push(footer(post, author, currentUser, isGridLayout))
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
    currentUser: PropTypes.object,
    isEditing: PropTypes.bool,
    isGridLayout: PropTypes.bool,
    isPostDetail: PropTypes.bool,
    isReposting: PropTypes.bool,
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
      currentUser,
      isGridLayout,
      isPostDetail,
      post,
      postBody,
    } = this.props
    if (!post) { return null }
    setModels({ assets })

    const showLovers = !isGridLayout && this.props.showLovers
    const showReposters = !isGridLayout && this.props.showReposters
    const showComments = !isPostDetail && this.props.showComments

    let postHeader
    if (isRepost(post)) {
      const { authorLinkObject, sourceLinkObject } = this.props
      postHeader = repostHeader(post, authorLinkObject, sourceLinkObject, author)
    } else {
      postHeader = header(post, author)
    }

    const showEditor = (post.isEditing || post.isReposting) && postBody
    return (
      <div className="Post">
        { postHeader }
        { showEditor ?
          <Editor post={ post } /> :
          parsePost(post, author, currentUser, isGridLayout)}
        { showLovers ? postLoversDrawer(post) : null }
        { showReposters ? postRepostersDrawer(post) : null }
        { showComments ? <Editor post={ post } isComment /> : null }
        { showComments && post.commentsCount > 0 ? commentStream(post, author, currentUser) : null }
      </div>)
  }
}

const mapStateToProps = ({ json, profile: currentUser }, ownProps) => {
  const post = json[MAPPING_TYPES.POSTS][ownProps.post.id]
  const author = json[MAPPING_TYPES.USERS][post.authorId]
  const assets = json.assets

  let newProps = {
    assets,
    author,
    currentUser,
    isEditing: post.isEditing || false,
    isReposting: post.isReposting || false,
    showComments: post.showComments || false,
    showLovers: post.showLovers || false,
    showReposters: post.showReposters || false,
    postBody: post.body,
    post,
  }

  if (isRepost(post)) {
    newProps = {
      ...newProps,
      authorLinkObject: post.repostAuthor || getLinkObject(post, 'repostAuthor', json),
      sourceLinkObject: getLinkObject(post, 'repostedSource', json),
    }
  }

  return newProps
}

export default connect(mapStateToProps)(PostParser)

