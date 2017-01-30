/* eslint-disable react/no-multi-comp */
import Immutable from 'immutable'
import React, { Component, PropTypes, PureComponent } from 'react'
import { Link } from 'react-router'
import { RegionItems } from '../regions/RegionRenderables'
import Avatar from '../assets/Avatar'
import CommentToolsContainer from '../../containers/CommentToolsContainer'

export class CommentHeader extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    commentId: PropTypes.string.isRequired,
  }
  render() {
    const { author, commentId } = this.props
    return (
      <header className="CommentHeader" key={`CommentHeader_${commentId}`}>
        <div className="CommentHeaderAuthor">
          <Link className="CommentHeaderLink" to={`/${author.get('username')}`}>
            <Avatar
              priority={author.get('relationshipPriority')}
              sources={author.get('avatar')}
              userId={`${author.get('id')}`}
              username={author.get('username')}
            />
            <span
              className="CommentUsername DraggableUsername"
              data-priority={author.get('relationshipPriority', 'inactive')}
              data-userid={author.get('id')}
              data-username={author.get('username')}
              draggable
            >
              {`@${author.get('username')}`}
            </span>
          </Link>
        </div>
      </header>
    )
  }
}

// TODO: convert this to a PureComponent once we get rid of passing assets
export class CommentBody extends Component {
  static propTypes = {
    assets: PropTypes.object,
    columnWidth: PropTypes.number.isRequired,
    commentId: PropTypes.string.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object.isRequired,
    contentWidth: PropTypes.number.isRequired,
    detailPath: PropTypes.string.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isGridMode: PropTypes.bool.isRequired,
  }
  static defaultProps = {
    assets: null,
  }
  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.content, this.props.content) ||
      ['contentWidth', 'innerHeight', 'isGridMode'].some(prop =>
        nextProps[prop] !== this.props[prop],
      )
  }
  render() {
    const {
      assets,
      columnWidth,
      commentId,
      commentOffset,
      content,
      contentWidth,
      detailPath,
      innerHeight,
      isGridMode,
    } = this.props
    return (
      <div className="CommentBody" key={`CommentBody${commentId}`} >
        <RegionItems
          assets={assets}
          columnWidth={columnWidth}
          commentId={commentId}
          commentOffset={commentOffset}
          content={content}
          contentWidth={contentWidth}
          detailPath={detailPath}
          innerHeight={innerHeight}
          isGridMode={isGridMode}
        />
      </div>
    )
  }
}

export const CommentFooter = ({ author, comment, currentUser, post }) => {
  return (
    <CommentToolsContainer
      author={author}
      comment={comment}
      currentUser={currentUser}
      key={`CommentTools_${comment.get('id')}`}
      post={post}
    />
  )
}

CommentFooter.propTypes = {
  author: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  post: PropTypes.object,
}
CommentFooter.defaultProps = {
  currentUser: null,
  post: null,
}

