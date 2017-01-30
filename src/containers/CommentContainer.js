import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as MAPPING_TYPES from '../constants/mapping_types'
import {
  selectColumnWidth,
  selectCommentOffset,
  selectContentWidth,
  selectInnerHeight,
  selectIsGridMode,
} from '../selectors/gui'
import Editor from '../components/editor/Editor'
import {
  CommentBody,
  CommentFooter,
  CommentHeader,
} from '../components/comments/CommentRenderables'
import { getPostDetailPath } from './PostContainer'

export function mapStateToProps(state, props) {
  const { commentId } = props
  const comment = state.json.getIn([MAPPING_TYPES.COMMENTS, commentId])
  const author = state.json.getIn([MAPPING_TYPES.USERS, comment.get('authorId')])
  const post = state.json.getIn([MAPPING_TYPES.POSTS, comment.get('postId')])
  const assets = state.json.get('assets')
  return {
    assets,
    author,
    columnWidth: selectColumnWidth(state),
    comment,
    commentId,
    commentBody: comment.get('body'),
    commentOffset: selectCommentOffset(state),
    content: comment.get('content'),
    contentWidth: selectContentWidth(state),
    currentUser: state.profile,
    detailPath: getPostDetailPath(author, post),
    innerHeight: selectInnerHeight(state),
    isEditing: comment.get('isEditing', false),
    isGridMode: selectIsGridMode(state),
    post,
  }
}

class CommentContainer extends Component {

  static propTypes = {
    assets: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired,
    columnWidth: PropTypes.number.isRequired,
    comment: PropTypes.object.isRequired,
    commentBody: PropTypes.object,
    commentId: PropTypes.string.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object.isRequired,
    contentWidth: PropTypes.number.isRequired,
    currentUser: PropTypes.object,
    detailPath: PropTypes.string.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired,
  }

  static defaultProps = {
    currentUser: null,
    commentBody: null,
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.assets, this.props.assets) ||
      !Immutable.is(nextProps.comment, this.props.comment) ||
      !Immutable.is(nextProps.currentUser, this.props.currentUser) ||
      !Immutable.is(nextProps.post, this.props.post) ||
      ['isGridMode'].some(prop => nextProps[prop] !== this.props[prop])
  }

  render() {
    const {
      assets,
      author,
      columnWidth,
      comment,
      commentBody,
      commentId,
      commentOffset,
      content,
      contentWidth,
      currentUser,
      detailPath,
      innerHeight,
      isEditing,
      isGridMode,
      post,
    } = this.props
    if (!comment || !comment.get('id') || !author || !author.get('id')) { return null }
    return (
      <div>
        {!isEditing ?
          <CommentHeader author={author} commentId={commentId} /> :
          null
        }
        {isEditing && commentBody ?
          <Editor isComment comment={comment} /> :
          <CommentBody
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
        }
        <CommentFooter
          author={author}
          comment={comment}
          currentUser={currentUser}
          post={post}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(CommentContainer)

