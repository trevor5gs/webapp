import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { openModal, closeModal } from '../../actions/modals'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import { DragIcon, DeleteIcon } from './EditorIcons'

class RegionTools extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  };

  deleteContentConfirmed = () => {
    // const { dispatch } = this.props
    this.closeModal()
    // dispatch(commentActions.deleteComment(comment))
  };

  handleDeleteBlock = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Remove this content?"
        onConfirm={ this.deleteCommentConfirmed }
        onRejected={ this.closeModal }
      />))
  };

  render() {
    return (
      <div className="RegionTools">
        <button
          onClick={this.handleDeleteBlock}
        >
          <DeleteIcon />
        </button>
        <button>
          <DragIcon />
        </button>
      </div>
    )
  }
}

export default connect()(RegionTools)

