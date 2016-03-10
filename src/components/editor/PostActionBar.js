import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { GUI } from '../../constants/gui_types'
import { openAlert, closeAlert } from '../../actions/modals'
import { savePostImage } from '../../actions/posts'
import Dialog from '../../components/dialogs/Dialog'
import { BrowseIcon, CameraIcon, CancelIcon, PostIcon, ReplyAllIcon } from './EditorIcons'

class PostActionBar extends Component {

  static propTypes = {
    cancelAction: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    disableSubmitAction: PropTypes.bool,
    editorId: PropTypes.string.isRequired,
    replyAllAction: PropTypes.func,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string,
  };

  submitted = () => {
    const { submitAction } = this.props
    submitAction()
  };

  isLegitFileType(file) {
    return (file && file.type && file.type.match(/^image\/(jpg|jpeg|gif|png|tiff|tif|bmp)/))
  }

  handleFileBrowser = (e) => {
    const { dispatch, editorId } = this.props
    for (const index in e.target.files) {
      if (e.target.files.hasOwnProperty(index)) {
        const file = e.target.files[index]
        if (this.isLegitFileType(file)) {
          dispatch(savePostImage(file, editorId, index))
        } else {
          dispatch(openAlert(
            <Dialog
              title="Invalid file type"
              body="We support .jpg, .gif, .png, or .bmp files for avatar and cover images."
              onClick={ bindActionCreators(closeAlert, dispatch) }
            />
          ))
          break
        }
      }
    }
  };

  browse = () => {
    this.refs.browseButton.blur()
    this.refs.FileBrowser.click()
    // return if window.diddrag.dragged()
    // @browseButton.blur()
    // @browseInput.click()
  };

  cancel = () => {
    this.props.cancelAction()
  };

  render() {
    const { disableSubmitAction, replyAllAction, submitText } = this.props
    return (
      <div className="editor-actions">

        <button className="PostActionButton forUpload" ref="browseButton" onClick={ this.browse }>
          <span className="PostActionButtonLabel">Upload</span>
          { GUI.viewportDeviceSize === 'mobile' ? <CameraIcon/> : <BrowseIcon /> }
        </button>

        <button className="PostActionButton forCancel" ref="cancelButton" onClick={ this.cancel }>
          <span className="PostActionButtonLabel">Cancel</span>
          <CancelIcon/>
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
          <PostIcon/>
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


export default connect()(PostActionBar)

