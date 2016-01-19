import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
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

class CommentTools extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      isMoreToolActive: false,
    }
  }

  getToolCells() {
    const { author, currentUser, isLoggedIn, comment } = this.props
    const isOwnComment = currentUser && author.id === currentUser.id
    const cells = []
    cells.push(
      <span className="PostTool TimeAgoTool" key={`TimeAgoTool_${comment.id}`}>
        <span className="PostToolValue">{new Date(comment.createdAt).timeAgoInWords()}</span>
        <Hint>Visit</Hint>
      </span>
    )
    if (isLoggedIn) {
      if (isOwnComment) {
        cells.push(
          <span className="PostTool EditTool ShyTool" key={`EditTool_${comment.id}`}>
            <button>
              <PencilIcon />
              <Hint>Edit</Hint>
            </button>
          </span>
        )
        cells.push(
          <span className="PostTool DeleteTool ShyTool" key={`DeleteTool_${comment.id}`}>
            <button onClick={ ::this.deleteComment }>
              <XBoxIcon />
              <Hint>Delete</Hint>
            </button>
          </span>
        )
      } else {
        cells.push(
          <span className="PostTool ReplyTool" key={`ReplyTool_${comment.id}`}>
            <button onClick={ ::this.replyToComment }>
              <ReplyIcon />
              <Hint>Reply</Hint>
            </button>
          </span>
        )
        cells.push(
          <span className="PostTool FlagTool ShyTool" key={`FlagTool_${comment.id}`}>
            <button onClick={ ::this.flagComment }>
              <FlagIcon />
              <Hint>Flag</Hint>
            </button>
          </span>
        )
      }
    }
    cells.push(
      <span className={"PostTool MoreTool"} key={`MoreTool_${comment.id}`}>
        <button onClick={ ::this.toggleActiveMoreTool }>
          <ChevronIcon />
          <Hint>More</Hint>
        </button>
      </span>
    )
    return cells
  }

  closeModal() {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  toggleActiveMoreTool() {
    this.setState({ isMoreToolActive: !this.state.isMoreToolActive })
  }

  signUp() {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'asDecapitated'))
    return dispatch(trackEvent('open-registration-request-post-tools'))
  }

  replyToComment() {
    // TODO: hook this up with the editor
  }

  flagComment() {
    const { dispatch } = this.props
    dispatch(openModal(
      <FlagDialog
        onResponse={ ::this.commentWasFlagged }
        onConfirm={ ::this.closeModal }
      />))
  }

  commentWasFlagged({ flag }) {
    const { dispatch, comment } = this.props
    dispatch(commentActions.flagComment(comment, flag))
  }

  deleteComment() {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Delete Comment?"
        onConfirm={ ::this.deleteCommentConfirmed }
        onRejected={ ::this.closeModal }
      />))
  }

  deleteCommentConfirmed() {
    const { comment, dispatch } = this.props
    this.closeModal()
    dispatch(commentActions.deleteComment(comment))
  }

  render() {
    const { comment } = this.props
    if (!comment) { return null }
    const classes = classNames(
      'PostTools',
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

CommentTools.propTypes = {
  author: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  comment: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(CommentTools)

