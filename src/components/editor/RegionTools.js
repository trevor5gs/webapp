import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { openModal, closeModal } from '../../actions/modals'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import { DragIcon, DeleteIcon } from './EditorIcons'

class RegionTools extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onRemoveBlock: PropTypes.func.isRequired,
  };

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  };

  deleteContentConfirmed = () => {
    const { onRemoveBlock } = this.props
    this.closeModal()
    onRemoveBlock()
  };

  handleDeleteBlock = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Remove this content?"
        onConfirm={ this.deleteContentConfirmed }
        onRejected={ this.closeModal }
      />))
  };

  render() {
    return (
      <div className="RegionTools">
        <button
          className="BlockRemove"
          onClick={ this.handleDeleteBlock }
        >
          <DeleteIcon />
        </button>
        <button
          className="DragHandler"
        >
          <DragIcon />
        </button>
      </div>
    )
  }
}

export default connect()(RegionTools)

