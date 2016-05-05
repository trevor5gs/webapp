import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BrowseIcon, CameraIcon, CancelIcon, PostIcon, ReplyAllIcon } from './EditorIcons'

class PostActionBar extends Component {

  static propTypes = {
    cancelAction: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    disableSubmitAction: PropTypes.bool,
    editorId: PropTypes.string.isRequired,
    handleFileAction: PropTypes.func.isRequired,
    replyAllAction: PropTypes.func,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string,
    viewportDeviceSize: PropTypes.string,
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

  render() {
    const { disableSubmitAction, replyAllAction, submitText, viewportDeviceSize } = this.props
    return (
      <div className="editor-actions">

        <button className="PostActionButton forUpload" ref="browseButton" onClick={ this.browse }>
          <span className="PostActionButtonLabel">Upload</span>
          { viewportDeviceSize === 'mobile' ? <CameraIcon /> : <BrowseIcon /> }
        </button>

        <button className="PostActionButton forCancel" ref="cancelButton" onClick={ this.cancel }>
          <span className="PostActionButtonLabel">Cancel</span>
          <CancelIcon />
        </button>

        {
          replyAllAction ?
            <button className="PostActionButton forReplyAll" onClick={ replyAllAction }>
              <span className="PostActionButtonLabel">Reply All</span>
              <ReplyAllIcon />
            </button> :
            null
        }

        <button
          className={ `PostActionButton for${submitText}` }
          disabled={ disableSubmitAction }
          ref="submitButton"
          onClick={ this.submitted }
        >
          <span className="PostActionButtonLabel">{ submitText }</span>
          <PostIcon />
        </button>

        <input
          className="hidden"
          onChange={ this.handleFileBrowser }
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
    viewportDeviceSize: gui.viewportDeviceSize,
  }
}

export default connect(mapStateToProps)(PostActionBar)

