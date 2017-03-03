/* eslint-disable react/no-multi-comp */
import React, { PropTypes, PureComponent } from 'react'
import { css } from 'glamor'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import ContentWarningButton from '../posts/ContentWarningButton'
import { RepostIcon } from '../posts/PostIcons'
import RelationshipContainer from '../../containers/RelationshipContainer'
import { RegionItems } from '../regions/RegionRenderables'

const PostHeaderTimeAgoLink = ({ to, createdAt }) =>
  <Link className="PostHeaderTimeAgoLink" to={to}>
    <span>{new Date(createdAt).timeAgoInWords()}</span>
  </Link>
PostHeaderTimeAgoLink.propTypes = {
  createdAt: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

export class PostHeader extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    detailPath: PropTypes.string.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    postCreatedAt: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
  }
  render() {
    const { author, detailPath, isPostDetail, postCreatedAt, postId } = this.props
    return (
      <header className="PostHeader" key={`PostHeader_${postId}`}>
        <div className="PostHeaderAuthor">
          <Link className="PostHeaderLink" to={`/${author.get('username')}`}>
            <Avatar
              priority={author.get('relationshipPriority')}
              sources={author.get('avatar')}
              userId={`${author.get('id')}`}
              username={author.get('username')}
            />
            <span
              className="DraggableUsername"
              data-priority={author.get('relationshipPriority') || 'inactive'}
              data-userid={author.get('id')}
              data-username={author.get('username')}
              draggable
            >
              {isPostDetail && author.get('name') ?
                <span>
                  <span className="PostHeaderAuthorName">{author.get('name')}</span>
                  <span className="PostHeaderAuthorUsername">@{author.get('username')}</span>
                </span>
                :
                `@${author.get('username')}`
              }
            </span>
          </Link>
        </div>
        <RelationshipContainer className="isInHeader" user={author} />
        <PostHeaderTimeAgoLink to={detailPath} createdAt={postCreatedAt} />
      </header>
    )
  }
}

export class CategoryHeader extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    categoryName: PropTypes.string.isRequired,
    categoryPath: PropTypes.string.isRequired,
    detailPath: PropTypes.string.isRequired,
    postCreatedAt: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
  }
  render() {
    const { author, categoryName, categoryPath, detailPath, postCreatedAt, postId } = this.props
    return (
      <header className="CategoryHeader" key={`CategoryHeader_${postId}`}>
        <div className="CategoryHeaderAuthor">
          <Link className="PostHeaderLink" to={`/${author.get('username')}`}>
            <Avatar
              priority={author.get('relationshipPriority')}
              sources={author.get('avatar')}
              userId={`${author.get('id')}`}
              username={author.get('username')}
            />
            <span
              className="DraggableUsername"
              data-priority={author.get('relationshipPriority') || 'inactive'}
              data-userid={author.get('id')}
              data-username={author.get('username')}
              draggable
            >
              {`@${author.get('username')}`}
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
        <PostHeaderTimeAgoLink to={detailPath} createdAt={postCreatedAt} />
      </header>
    )
  }
}

export class RepostHeader extends PureComponent {
  static propTypes = {
    detailPath: PropTypes.string.isRequired,
    inUserDetail: PropTypes.bool.isRequired,
    postCreatedAt: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    repostAuthor: PropTypes.object.isRequired,
    repostedBy: PropTypes.object.isRequired,
  }
  render() {
    const { detailPath, inUserDetail, postCreatedAt, postId, repostAuthor, repostedBy } = this.props
    return (
      <header className={classNames('RepostHeader', { inUserDetail })} key={`RepostHeader_${postId}`}>
        <div className="RepostHeaderAuthor">
          <Link className="PostHeaderLink" to={`/${repostAuthor.get('username')}`}>
            <Avatar
              priority={repostAuthor.get('relationshipPriority')}
              sources={repostAuthor.get('avatar')}
              userId={`${repostAuthor.get('id')}`}
              username={repostAuthor.get('username')}
            />
            <span
              className="DraggableUsername"
              data-priority={repostAuthor.get('relationshipPriority') || 'inactive'}
              data-userid={repostAuthor.get('id')}
              data-username={repostAuthor.get('username')}
              draggable
            >
              {`@${repostAuthor.get('username')}`}
            </span>
          </Link>
        </div>
        <RelationshipContainer className="isInHeader" user={repostAuthor} />
        <div className="RepostHeaderReposter">
          <Link className="PostHeaderLink" to={`/${repostedBy.get('username')}`}>
            <RepostIcon />
            <span
              className="DraggableUsername"
              data-priority={repostedBy.get('relationshipPriority') || 'inactive'}
              data-userid={repostedBy.get('id')}
              data-username={repostedBy.get('username')}
              draggable
            >
              {` by @${repostedBy.get('username')}`}
            </span>
          </Link>
        </div>
        <PostHeaderTimeAgoLink to={detailPath} createdAt={postCreatedAt} />
      </header>
    )
  }
}

export class PostBody extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    columnWidth: PropTypes.number.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object.isRequired,
    contentWarning: PropTypes.string,
    contentWidth: PropTypes.number.isRequired,
    detailPath: PropTypes.string.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isRepost: PropTypes.bool.isRequired,
    postId: PropTypes.string.isRequired,
    repostContent: PropTypes.object,
    summary: PropTypes.object.isRequired,
  }
  static defaultProps = {
    contentWarning: null,
    repostContent: null,
  }
  render() {
    const {
      author,
      columnWidth,
      commentOffset,
      content,
      contentWarning,
      contentWidth,
      detailPath,
      innerHeight,
      isGridMode,
      isRepost,
      postId,
      repostContent,
      summary,
    } = this.props
    const cells = []

    if (contentWarning) {
      cells.push(<ContentWarningButton contentWarning={contentWarning} key={`contentWarning_${postId}`} />)
    }

    const regionProps = {
      columnWidth,
      commentOffset,
      contentWidth,
      detailPath,
      innerHeight,
      isGridMode,
    }
    if (isRepost) {
      // this is weird, but the post summary is
      // actually the repost summary on reposts
      if (isGridMode) {
        regionProps.content = summary
        cells.push(<RegionItems {...regionProps} key={`RegionItems_${postId}`} />)
      } else {
        regionProps.content = repostContent
        cells.push(<RegionItems {...regionProps} key={`RegionItems_${postId}`} />)
        if (content && content.size) {
          regionProps.content = content
          cells.push(
            <div className="PostBody RepostedBody" key={`RepostedBody_${postId}`}>
              <Avatar
                priority={author.get('relationshipPriority')}
                sources={author.get('avatar')}
                to={`/${author.get('username')}`}
                userId={`${author.get('id')}`}
                username={author.get('username')}
              />
              <RegionItems {...regionProps} />
            </div>,
          )
        }
      }
    } else {
      regionProps.content = isGridMode ? summary : content
      cells.push(<RegionItems {...regionProps} key={`RegionItems_${postId}`} />)
    }
    return (
      <div className="PostBody" key={`PostBody_${postId}`}>
        {cells}
      </div>
    )
  }
}

const relatedPostButtonStyles = css({
  position: 'absolute',
  right: 0,
  top: 0,
  fontSize: 18,
  color: '#aaa',
})

export const RelatedPostsButton = (props, { onClickScrollToRelatedPosts }) =>
  <button
    onClick={onClickScrollToRelatedPosts}
    {...relatedPostButtonStyles}
  >
    Related Posts
  </button>
RelatedPostsButton.contextTypes = {
  onClickScrollToRelatedPosts: PropTypes.func.isRequired,
}

