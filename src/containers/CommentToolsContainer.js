import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { isEqual, pick } from 'lodash'
import * as ACTION_TYPES from '../constants/action_types'
import * as commentActions from '../actions/comments'
import { openModal, closeModal } from '../actions/modals'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import FlagDialog from '../components/dialogs/FlagDialog'
import { getEditorId } from '../components/editor/Editor'
import { scrollToLastTextBlock } from '../vendor/scrolling'
import { CommentTools } from '../components/comments/CommentTools'


export function shouldContainerUpdate(thisProps, nextProps) {
  if (!nextProps.comment) { return false }
  const pickProps = ['isLoggedIn', 'isNavbarHidden', 'isOwnComment', 'isOwnPost', 'isOwnRepost']
  const thisCompare = pick(thisProps, pickProps)
  const nextCompare = pick(nextProps, pickProps)
  return !isEqual(thisCompare, nextCompare)
}

export function mapStateToProps(state, props) {
  const { author, comment, currentUser, post } = props
  const isOwnComment = currentUser && `${author.id}` === `${currentUser.id}`
  const isOwnPost = currentUser && `${post.authorId}` === `${currentUser.id}`
  let canDeleteComment = isOwnPost
  if (post.repostId) {
    canDeleteComment = isOwnPost && comment.postId === post.id
  }
  return {
    canDeleteComment,
    deviceSize: state.gui.deviceSize,
    isLoggedIn: state.authentication.isLoggedIn,
    isNavbarHidden: state.gui.isNavbarHidden,
    isOwnComment,
  }
}

class CommentToolsContainer extends Component {
  static propTypes = {
    author: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    deviceSize: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isNavbarHidden: PropTypes.bool,
    post: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.state = {
      isMoreToolActive: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isMoreToolActive !== nextState.isMoreToolActive) { return true }
    return shouldContainerUpdate(this.props, nextProps)
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
        text: `@${author.username} `,
      },
    })
    scrollToLastTextBlock(editorId, isNavbarHidden)
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

  onClickDeleteComment = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Delete Comment?"
        onConfirm={this.onConfirmDeleteComment}
        onDismiss={this.onCloseModal}
      />))
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onConfirmDeleteComment = () => {
    const { comment, dispatch } = this.props
    this.onCloseModal()
    dispatch(commentActions.deleteComment(comment))
  }

  render() {
    const toolProps = {
      ...this.props,
      isMoreToolActive: this.state.isMoreToolActive,
      onClickDeleteComment: this.onClickDeleteComment,
      onClickEditComment: this.onClickEditComment,
      onClickFlagComment: this.onClickFlagComment,
      onClickMoreTool: this.onClickMoreTool,
      onClickReplyToComment: this.onClickReplyToComment,
    }
    return <CommentTools {...toolProps} />
  }

}

export default connect(mapStateToProps)(CommentToolsContainer)

