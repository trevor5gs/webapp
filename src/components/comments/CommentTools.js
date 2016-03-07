import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import * as ACTION_TYPES from '../../constants/action_types'
import { openModal, closeModal } from '../../actions/modals'
import * as commentActions from '../../actions/comments'
import { trackEvent } from '../../actions/tracking'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import FlagDialog from '../dialogs/FlagDialog'
import RegistrationRequestDialog from '../dialogs/RegistrationRequestDialog'
import Hint from '../hints/Hint'
import {
  ChevronIcon,
  FlagIcon,
  PencilIcon,
  ReplyIcon,
  XBoxIcon,
} from '../posts/PostIcons'
import { getEditorId } from '../editor/Editor'

class CommentTools extends Component {

  static propTypes = {
    author: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.state = {
      isMoreToolActive: false,
    }
  }

  onClickMoreTool = () => {
    this.setState({ isMoreToolActive: !this.state.isMoreToolActive })
  };

  onClickReplyToComment = () => {
    const { author, dispatch, post } = this.props
    dispatch({
      type: ACTION_TYPES.EDITOR.APPEND_TEXT,
      payload: {
        editorId: getEditorId(post),
        text: `@${author.username} `,
      },
    })
  };

  onClickEditComment = () => {
    const { comment, dispatch } = this.props
    dispatch(commentActions.toggleEditing(comment, true))
    dispatch(commentActions.loadEditableComment(comment))
  };

  onClickFlagComment = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <FlagDialog
        onResponse={ this.onCommentWasFlagged }
        onConfirm={ this.closeModal }
      />))
  };

  onCommentWasFlagged = ({ flag }) => {
    const { dispatch, comment } = this.props
    dispatch(commentActions.flagComment(comment, flag))
  };

  onClickDeleteComment = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Delete Comment?"
        onConfirm={ this.onConfirmDeleteComment }
        onDismiss={ this.closeModal }
      />))
  };

  onConfirmDeleteComment = () => {
    const { comment, dispatch } = this.props
    this.closeModal()
    dispatch(commentActions.deleteComment(comment))
  };

  getToolCells() {
    const { author, comment, currentUser, isLoggedIn, post } = this.props
    const isOwnComment = currentUser && author.id === currentUser.id
    const isOwnPost = currentUser && post.authorId === currentUser.id
    const cells = []
    cells.push(
      <span className="PostTool TimeAgoTool" key={`TimeAgoTool_${comment.id}`}>
        <span className="PostToolValue">{new Date(comment.createdAt).timeAgoInWords()}</span>
      </span>
    )
    if (isLoggedIn) {
      if (isOwnComment) {
        cells.push(
          <span className="PostTool EditTool ShyTool" key={`EditTool_${comment.id}`}>
            <button onClick={ this.onClickEditComment }>
              <PencilIcon />
              <Hint>Edit</Hint>
            </button>
          </span>
        )
        cells.push(
          <span className="PostTool DeleteTool ShyTool" key={`DeleteTool_${comment.id}`}>
            <button onClick={ this.onClickDeleteComment }>
              <XBoxIcon />
              <Hint>Delete</Hint>
            </button>
          </span>
        )
      } else if (isOwnPost) {
        cells.push(
          <span className="PostTool ReplyTool" key={`ReplyTool_${comment.id}`}>
            <button onClick={ this.onClickReplyToComment }>
              <ReplyIcon />
              <Hint>Reply</Hint>
            </button>
          </span>
        )
        cells.push(
          <span className="PostTool DeleteTool ShyTool" key={`DeleteTool_${comment.id}`}>
            <button onClick={ this.onClickDeleteComment }>
              <XBoxIcon />
              <Hint>Delete</Hint>
            </button>
          </span>
        )
      } else {
        cells.push(
          <span className="PostTool ReplyTool" key={`ReplyTool_${comment.id}`}>
            <button onClick={ this.onClickReplyToComment }>
              <ReplyIcon />
              <Hint>Reply</Hint>
            </button>
          </span>
        )
        cells.push(
          <span className="PostTool FlagTool ShyTool" key={`FlagTool_${comment.id}`}>
            <button onClick={ this.onClickFlagComment }>
              <FlagIcon />
              <Hint>Flag</Hint>
            </button>
          </span>
        )
      }
    }
    cells.push(
      <span className={"PostTool MoreTool"} key={`MoreTool_${comment.id}`}>
        <button onClick={ this.onClickMoreTool }>
          <ChevronIcon />
          <Hint>More</Hint>
        </button>
      </span>
    )
    return cells
  }

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  };

  signUp() {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'asDecapitated'))
    return dispatch(trackEvent('open-registration-request-post-tools'))
  }

  render() {
    const { comment } = this.props
    if (!comment) { return null }
    const classes = classNames(
      'PostTools',
      'CommentTools',
      { isMoreToolActive: this.state.isMoreToolActive },
    )
    return (
      <footer className={classes}>
        {this.getToolCells()}
      </footer>
    )
  }
}


function mapStateToProps(state) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
  }
}

export default connect(mapStateToProps)(CommentTools)

