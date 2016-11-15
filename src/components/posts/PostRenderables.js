import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import { UserDrawer } from '../users/UserRenderables'
import ContentWarningButton from '../posts/ContentWarningButton'
import PostToolsContainer from '../../containers/PostToolsContainer'
import { HeartIcon, RepostIcon } from '../posts/PostIcons'
import RelationshipContainer from '../../containers/RelationshipContainer'
import { postLovers, postReposters } from '../../networking/api'
import StreamContainer from '../../containers/StreamContainer'
import { loadComments } from '../../actions/posts'
import { RegionItems } from '../regions/RegionRenderables'

function getPostDetailPath(author, post) {
  return `/${author.username}/post/${post.token}`
}

export const PostLoversDrawer = ({ post }) =>
  <UserDrawer
    endpoint={postLovers(post.id)}
    icon={<HeartIcon />}
    key={`userAvatarsLovers_${post.id}${post.lovesCount}`}
    post={post}
    resultType="love"
  />

PostLoversDrawer.propTypes = {
  post: PropTypes.object,
}

export const PostRepostersDrawer = ({ post }) =>
  <UserDrawer
    endpoint={postReposters(post.id)}
    icon={<RepostIcon />}
    key={`userAvatarsReposters_${post.id}${post.repostsCount}`}
    post={post}
    resultType="repost"
  />

PostRepostersDrawer.propTypes = {
  post: PropTypes.object,
}

export const CommentStream = ({ post, author }) =>
  <div>
    <StreamContainer
      className="CommentStreamContainer isFullWidth"
      action={loadComments(post)}
      ignoresScrollPosition
    >
      {post.commentsCount > 10 ?
        <Link
          to={{
            pathname: `/${author.username}/post/${post.token}`,
            state: { didComeFromSeeMoreCommentsLink: true },
          }}
          className="CommentsLink"
        >
          See More
        </Link>
        : null
      }
    </StreamContainer>
  </div>

CommentStream.propTypes = {
  author: PropTypes.object,
  post: PropTypes.object,
}

const PostHeaderTimeAgoLink = ({ to, createdAt }) =>
  <Link className="PostHeaderTimeAgoLink" to={to}>
    <span>{new Date(createdAt).timeAgoInWords()}</span>
  </Link>

PostHeaderTimeAgoLink.propTypes = {
  createdAt: PropTypes.string,
  to: PropTypes.string,
}

export const PostHeader = ({ post, author, isPostDetail = false }) => {
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
            {isPostDetail && author.name ?
              <span>
                <span className="PostHeaderAuthorName">{author.name}</span>
                <span className="PostHeaderAuthorUsername">@{author.username}</span>
              </span>
              :
              `@${author.username}`
            }
          </span>
        </Link>
      </div>
      <RelationshipContainer className="isInHeader" user={author} />
      <PostHeaderTimeAgoLink to={postDetailPath} createdAt={post.createdAt} />
    </header>
  )
}

PostHeader.propTypes = {
  author: PropTypes.object,
  isPostDetail: PropTypes.bool,
  post: PropTypes.object,
}

export const CategoryHeader = ({ post, author, categoryName, categoryPath }) => {
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

CategoryHeader.propTypes = {
  author: PropTypes.object,
  categoryName: PropTypes.string,
  categoryPath: PropTypes.string,
  post: PropTypes.object,
}

export const RepostHeader = ({ post, repostAuthor, repostedBy, inUserDetail }) => {
  if (!post || !repostedBy) { return null }
  const postDetailPath = getPostDetailPath(repostAuthor, post)
  return (
    <header className={classNames('RepostHeader', { inUserDetail })} key={`RepostHeader_${post.id}`}>
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

RepostHeader.propTypes = {
  inUserDetail: PropTypes.bool,
  post: PropTypes.object,
  repostAuthor: PropTypes.object,
  repostedBy: PropTypes.object,
}

export const PostBody = (props) => {
  const { assets, author, columnWidth, commentOffset, contentWarning,
    contentWidth, innerHeight, isGridMode, post } = props
  if (!post || !author) { return null }
  const cells = []
  const postDetailPath = getPostDetailPath(author, post)

  if (contentWarning) {
    cells.push(<ContentWarningButton key={`contentWarning_${post.id}`} post={post} />)
  }

  const regionProps = {
    assets,
    columnWidth,
    commentOffset,
    contentWidth,
    innerHeight,
    isGridMode,
    postDetailPath,
  }
  if (post.repostContent && post.repostContent.length) {
    // this is weird, but the post summary is
    // actually the repost summary on reposts
    if (isGridMode) {
      regionProps.content = post.summary
      cells.push(<RegionItems {...regionProps} key={`RegionItems_${post.id}`} />)
    } else {
      regionProps.content = post.repostContent
      cells.push(<RegionItems {...regionProps} key={`RegionItems_${post.id}`} />)
      if (post.content && post.content.length) {
        regionProps.content = post.content
        cells.push(
          <div className="PostBody RepostedBody" key={`RepostedBody_${post.id}`}>
            <Avatar
              priority={author.relationshipPriority}
              sources={author.avatar}
              to={`/${author.username}`}
              userId={`${author.id}`}
              username={author.username}
            />
            <RegionItems {...regionProps} />
          </div>
        )
      }
    }
  } else {
    const content = isGridMode ? post.summary : post.content
    regionProps.content = content
    cells.push(<RegionItems {...regionProps} key={`RegionItems_${post.id}`} />)
  }
  return (
    <div className="PostBody" key={`PostBody_${post.id}`}>
      {cells}
    </div>
  )
}

PostBody.propTypes = {
  assets: PropTypes.object,
  author: PropTypes.object,
  columnWidth: PropTypes.number,
  commentOffset: PropTypes.number,
  contentWarning: PropTypes.string,
  contentWidth: PropTypes.number,
  innerHeight: PropTypes.number,
  isGridMode: PropTypes.bool,
  post: PropTypes.object,
}

export const PostFooter = ({ post, author, isGridMode, isRepostAnimating }) => {
  if (!author) { return null }
  return (
    <PostToolsContainer
      author={author}
      post={post}
      isGridMode={isGridMode}
      isRepostAnimating={isRepostAnimating}
      key={`PostTools_${post.id}`}
    />
  )
}

PostFooter.propTypes = {
  author: PropTypes.object,
  isGridMode: PropTypes.bool,
  isRepostAnimating: PropTypes.bool,
  post: PropTypes.object,
}

