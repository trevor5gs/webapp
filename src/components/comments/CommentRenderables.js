import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { RegionItems } from '../regions/RegionRenderables'
import Avatar from '../assets/Avatar'
import CommentToolsContainer from '../../containers/CommentToolsContainer'

export const CommentHeader = ({ comment, author }) => {
  if (!comment || !author) { return null }
  return (
    <header className="CommentHeader" key={`CommentHeader_${comment.id}`}>
      <div className="CommentHeaderAuthor">
        <Link className="CommentHeaderLink" to={`/${author.username}`}>
          <Avatar
            priority={author.relationshipPriority}
            sources={author.avatar}
            userId={`${author.id}`}
            username={author.username}
          />
          <span
            className="CommentUsername DraggableUsername"
            data-priority={author.relationshipPriority || 'inactive'}
            data-userid={author.id}
            data-username={author.username}
            draggable
          >
            {`@${author.username}`}
          </span>
        </Link>
      </div>
    </header>
  )
}

CommentHeader.propTypes = {
  author: PropTypes.object,
  comment: PropTypes.object,
}

export const CommentBody = ({ assets, comment, isGridMode = true }) =>
  <div className="CommentBody" key={`CommentBody${comment.id}`} >
    <RegionItems
      assets={assets}
      content={comment.content}
      isGridMode={isGridMode}
    />
  </div>

CommentBody.propTypes = {
  assets: PropTypes.object,
  comment: PropTypes.object,
  isGridMode: PropTypes.bool,
}

export const CommentFooter = ({ author, comment, currentUser, post }) => {
  if (!author) { return null }
  return (
    <CommentToolsContainer
      author={author}
      comment={comment}
      currentUser={currentUser}
      key={`CommentTools_${comment.id}`}
      post={post}
    />
  )
}

CommentFooter.propTypes = {
  author: PropTypes.object,
  comment: PropTypes.object,
  currentUser: PropTypes.object,
  post: PropTypes.object,
}

