import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import {
  BrowseIcon, CheckIcon, CameraIcon, CancelIcon, PostIcon, ReplyAllIcon, MoneyIcon,
} from './EditorIcons'
import { openModal, closeModal } from '../../actions/modals'
import { updateBuyLink } from '../../actions/editor'
import BuyLinkDialog from '../dialogs/BuyLinkDialog'

class PostActionBar extends Component {

  static propTypes = {
    buyLink: PropTypes.string,
    cancelAction: PropTypes.func.isRequired,
    deviceSize: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    disableSubmitAction: PropTypes.bool,
    editorId: PropTypes.string.isRequired,
    handleFileAction: PropTypes.func.isRequired,
    hasMedia: PropTypes.bool,
    replyAllAction: PropTypes.func,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string,
  }

  onAddBuyLink = ({ value }) => {
    const { dispatch, editorId } = this.props
    dispatch(updateBuyLink(editorId, value))
    this.onCloseModal()
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  submitted = () => {
    const { submitAction } = this.props
    submitAction()
  }

  handleFileBrowser = (e) => {
    const { handleFileAction } = this.props
    handleFileAction(e)
    this.refs.FileBrowser.value = ''
  }

  browse = () => {
    this.refs.browseButton.blur()
    this.refs.FileBrowser.click()
  }

  cancel = () => {
    this.props.cancelAction()
  }

  money = () => {
    const { dispatch, buyLink } = this.props
    dispatch(openModal(
      <BuyLinkDialog
        onConfirm={this.onAddBuyLink}
        onDismiss={this.onCloseModal}
        text={buyLink}
      />))
  }

  render() {
    const { deviceSize, disableSubmitAction, hasMedia, replyAllAction, submitText } = this.props
    const isBuyLinked = this.props.buyLink && this.props.buyLink.length
    return (
      <div className="editor-actions">
        <button
          className={classNames('PostActionButton forMoney', { isBuyLinked })}
          disabled={!hasMedia}
          ref="moneyButton"
          onClick={this.money}
        >
          <span className="PostActionButtonLabel">Sell</span>
          <MoneyIcon />
          <CheckIcon />
        </button>

        <button className="PostActionButton forUpload" ref="browseButton" onClick={this.browse}>
          <span className="PostActionButtonLabel">Upload</span>
          {deviceSize === 'mobile' ? <CameraIcon /> : <BrowseIcon />}
        </button>

        <button className="PostActionButton forCancel" ref="cancelButton" onClick={this.cancel}>
          <span className="PostActionButtonLabel">Cancel</span>
          <CancelIcon />
        </button>

        {
          replyAllAction ?
            <button className="PostActionButton forReplyAll" onClick={replyAllAction}>
              <span className="PostActionButtonLabel">Reply All</span>
              <ReplyAllIcon />
            </button> :
            null
        }

        <button
          className={`PostActionButton for${submitText}`}
          disabled={disableSubmitAction}
          ref="submitButton"
          onClick={this.submitted}
        >
          <span className="PostActionButtonLabel">{submitText}</span>
          <PostIcon />
        </button>

        <input
          className="hidden"
          onChange={this.handleFileBrowser}
          ref="FileBrowser"
          type="file"
          accept="image/*"
          multiple
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { gui } = state
  return {
    deviceSize: gui.deviceSize,
  }
}

export default connect(mapStateToProps)(PostActionBar)

