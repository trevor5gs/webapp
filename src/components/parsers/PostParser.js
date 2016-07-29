import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { body, repostedBody, setAssets } from './RegionParser'
import Avatar from '../assets/Avatar'
import UserAvatars from '../../components/users/UserAvatars'
import ContentWarningButton from '../posts/ContentWarningButton'
import PostToolsContainer from '../../containers/PostToolsContainer'
import CommentStream from '../streams/CommentStream'
import { HeartIcon, RepostIcon } from '../posts/PostIcons'
import RelationshipContainer from '../../containers/RelationshipContainer'
import Editor from '../../components/editor/Editor'
import { postLovers, postReposters } from '../../networking/api'

function getPostDetailPath(author, post) {
  return `/${author.username}/post/${post.token}`
}

export function postLoversDrawer(post) {
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

export function postRepostersDrawer(post) {
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

export function commentStream(post, author) {
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

export function header(post, author) {
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
      <RelationshipContainer className="isInHeader" user={author} />
      <PostHeaderTimeAgoLink to={postDetailPath} createdAt={post.createdAt} />
    </header>
  )
}

export function categoryHeader(post, author, categoryName, categoryPath) {
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
      <RelationshipContainer className="isInHeader" user={author} />
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

export function repostHeader(post, repostAuthor, repostSource, repostedBy) {
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
      <RelationshipContainer className="isInHeader" user={repostAuthor} />
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
    <PostToolsContainer
      author={author}
      post={post}
      isGridLayout={isGridLayout}
      isRepostAnimating={isRepostAnimating}
      key={`PostTools_${post.id}`}
    />
  )
}

export function parsePostBody(post, author, currentUser,
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
  setAssets({})
  return cells
}

