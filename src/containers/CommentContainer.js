import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectIsOwnComment } from '../selectors/comment'
import {
  selectColumnWidth,
  selectCommentOffset,
  selectContentWidth,
  selectDeviceSize,
  selectInnerHeight,
  selectIsGridMode,
  selectIsNavbarHidden,
} from '../selectors/gui'
import { selectIsOwnPost } from '../selectors/post'
import Editor, { getEditorId } from '../components/editor/Editor'
import {
  CommentBody,
  CommentHeader,
} from '../components/comments/CommentRenderables'
import CommentTools from '../components/comments/CommentTools'
import { getPostDetailPath } from './PostContainer'
import * as commentActions from '../actions/comments'
import { openModal, closeModal } from '../actions/modals'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import FlagDialog from '../components/dialogs/FlagDialog'
import { scrollToLastTextBlock } from '../lib/jello'

export function mapStateToProps(state, props) {
  const { commentId } = props
  const assets = state.json.get('assets')
  const comment = state.json.getIn([MAPPING_TYPES.COMMENTS, commentId])
  const author = state.json.getIn([MAPPING_TYPES.USERS, comment.get('authorId')])
  const post = state.json.getIn([MAPPING_TYPES.POSTS, comment.get('postId')])

  const isOwnComment = selectIsOwnComment(state, props)
  const isOwnPost = selectIsOwnPost(state, props)
  let canDeleteComment = isOwnPost
  if (post.get('repostId')) {
    canDeleteComment = isOwnPost && comment.get('originalPostId') === post.get('id')
  }

  return {
    assets,
    author,
    canDeleteComment,
    columnWidth: selectColumnWidth(state),
    comment,
    commentCreatedAt: comment.get('createdAt'),
    commentId,
    commentBody: comment.get('body'),
    commentOffset: selectCommentOffset(state),
    content: comment.get('content'),
    contentWidth: selectContentWidth(state),
    detailPath: getPostDetailPath(author, post),
    deviceSize: selectDeviceSize(state),
    innerHeight: selectInnerHeight(state),
    isEditing: comment.get('isEditing', false),
    isGridMode: selectIsGridMode(state),
    isLoggedIn: selectIsLoggedIn(state),
    isNavbarHidden: selectIsNavbarHidden(state),
    isOwnComment,
    post,
  }
}

class CommentContainer extends Component {

  static propTypes = {
    assets: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired,
    canDeleteComment: PropTypes.bool.isRequired,
    columnWidth: PropTypes.number.isRequired,
    comment: PropTypes.object.isRequired,
    commentBody: PropTypes.object,
    commentCreatedAt: PropTypes.string.isRequired,
    commentId: PropTypes.string.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object.isRequired,
    contentWidth: PropTypes.number.isRequired,
    detailPath: PropTypes.string.isRequired,
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isNavbarHidden: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired,
  }

  static defaultProps = {
    commentBody: null,
  }

  static childContextTypes = {
    onClickDeleteComment: PropTypes.func.isRequired,
    onClickEditComment: PropTypes.func.isRequired,
    onClickFlagComment: PropTypes.func.isRequired,
    onClickMoreTool: PropTypes.func.isRequired,
    onClickReplyToComment: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      onClickDeleteComment: this.onClickDeleteComment,
      onClickEditComment: this.onClickEditComment,
      onClickFlagComment: this.onClickFlagComment,
      onClickMoreTool: this.onClickMoreTool,
      onClickReplyToComment: this.onClickReplyToComment,
    }
  }

  componentWillMount() {
    this.state = {
      isMoreToolActive: false,
    }
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.assets, this.props.assets) ||
      !Immutable.is(nextProps.comment, this.props.comment) ||
      !Immutable.is(nextProps.post, this.props.post) ||
      ['isGridMode'].some(prop => nextProps[prop] !== this.props[prop])
  }

  onClickDeleteComment = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Delete Comment?"
        onConfirm={this.onConfirmDeleteComment}
        onDismiss={this.onCloseModal}
      />))
  }

  onConfirmDeleteComment = () => {
    const { comment, dispatch } = this.props
    this.onCloseModal()
    dispatch(commentActions.deleteComment(comment))
  }

  onClickEditComment = () => {
    const { comment, dispatch } = this.props
    dispatch(commentActions.toggleEditing(comment, true))
    dispatch(commentActions.loadEditableComment(comment))
  }

  onClickFlagComment = () => {
    const { deviceSize, dispatch } = this.props
    dispatch(openModal(
      <FlagDialog
        deviceSize={deviceSize}
        onResponse={this.onCommentWasFlagged}
        onConfirm={this.onCloseModal}
      />))
  }

  onCommentWasFlagged = ({ flag }) => {
    const { dispatch, comment } = this.props
    dispatch(commentActions.flagComment(comment, flag))
  }

  onClickMoreTool = () => {
    this.setState({ isMoreToolActive: !this.state.isMoreToolActive })
  }

  onClickReplyToComment = () => {
    const { author, dispatch, isNavbarHidden, post } = this.props
    const editorId = getEditorId(post, null, true, false)
    dispatch({
      type: ACTION_TYPES.EDITOR.APPEND_TEXT,
      payload: {
        editorId,
        text: `@${author.get('username')} `,
      },
    })
    scrollToLastTextBlock(editorId, isNavbarHidden)
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  render() {
    const {
      assets,
      author,
      canDeleteComment,
      columnWidth,
      comment,
      commentBody,
      commentCreatedAt,
      commentId,
      commentOffset,
      content,
      contentWidth,
      detailPath,
      innerHeight,
      isEditing,
      isGridMode,
      isLoggedIn,
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
        <CommentTools
          canDeleteComment={canDeleteComment}
          commentCreatedAt={commentCreatedAt}
          commentId={commentId}
          isLoggedIn={isLoggedIn}
          isMoreToolActive={this.state.isMoreToolActive}
          key={`CommentTools_${commentId}`}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(CommentContainer)

