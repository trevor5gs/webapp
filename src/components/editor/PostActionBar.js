import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  BrowseIcon, CameraIcon, CancelIcon, PostIcon, ReplyAllIcon, MoneyIcon,
} from './EditorIcons'
import { openModal, closeModal } from '../../actions/modals'
import { updateAffiliateLink } from '../../actions/editor'
import AffiliateDialog from '../dialogs/AffiliateDialog'

class PostActionBar extends Component {

  static propTypes = {
    affiliateLink: PropTypes.string,
    cancelAction: PropTypes.func.isRequired,
    deviceSize: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    disableSubmitAction: PropTypes.bool,
    editorId: PropTypes.string.isRequired,
    handleFileAction: PropTypes.func.isRequired,
    replyAllAction: PropTypes.func,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string,
  }

  onAddAffiliateLink = ({ value }) => {
    console.log('onAddAffiliateLink', value)
    const { dispatch, editorId } = this.props
    dispatch(updateAffiliateLink(editorId, value))
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
    const { dispatch, affiliateLink } = this.props
    dispatch(openModal(
      <AffiliateDialog
        onConfirm={this.onAddAffiliateLink}
        onDismiss={this.onCloseModal}
        text={affiliateLink}
      />))
  }

  render() {
    const { deviceSize, disableSubmitAction, replyAllAction, submitText } = this.props
    return (
      <div className="editor-actions">

        <button className="PostActionButton forMoney" ref="moneyButton" onClick={this.money}>
          <span className="PostActionButtonLabel">Sell</span>
          <MoneyIcon />
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

