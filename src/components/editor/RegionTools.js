import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { openModal, closeModal } from '../../actions/modals'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import { DragIcon, DeleteIcon } from './EditorIcons'

class RegionTools extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    editorId: PropTypes.string.isRequired,
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
        onDismiss={ this.closeModal }
      />))
  };

  render() {
    const { editorId } = this.props
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
          data-drag-id={ editorId }
        >
          <DragIcon />
        </button>
      </div>
    )
  }
}

export default connect()(RegionTools)

