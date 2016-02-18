import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { GUI } from '../../constants/gui_types'
import { openAlert, closeAlert } from '../../actions/modals'
import { savePostImage } from '../../actions/posts'
import Dialog from '../../components/dialogs/Dialog'
import { PostIcon, CancelIcon, BrowseIcon, CameraIcon } from './EditorIcons'

class PostActionBar extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    cancelAction: PropTypes.func.isRequired,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string,
  };

  submitted = () => {
    const { submitAction } = this.props
    submitAction()
    // return if window.diddrag.dragged()
    // return if @submitButton.classList.contains('sending')
    // $hideSoftKeyboard()
    // @editor.submit()
    // @submitButton.setAttribute('disabled', 'disabled')
    // @submitButton.classList.add('sending')
  };

  isLegitimateFileType(file) {
    return (file && file.type && file.type.match(/^image\/(jpg|jpeg|gif|png|tiff|tif|bmp)/))
  }

  handleFileBrowser = (e) => {
    const file = e.target.files[0]
    const { dispatch } = this.props
    if (this.isLegitimateFileType(file)) {
      return dispatch(savePostImage(file))
    }
    return dispatch(openAlert(
      <Dialog
        title="Invalid file type"
        body="We support .jpg, .gif, .png, or .bmp files for avatar and cover images."
        onClick={ bindActionCreators(closeAlert, dispatch) }
      />
    ))
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
    return (
      <div className="editor-actions">

        <button className="PostActionButton" ref="browseButton" onClick={ this.browse }>
          <span className="PostActionButtonLabel">Upload</span>
          { GUI.viewportDeviceSize === 'mobile' ? <CameraIcon/> : <BrowseIcon /> }
        </button>

        <button className="PostActionButton" ref="cancelButton" onClick={ this.cancel }>
          <span className="PostActionButtonLabel">Cancel</span>
          <CancelIcon/>
        </button>

        <button className="PostActionButton forPost" ref="submitButton" onClick={ this.submitted }>
          <span className="PostActionButtonLabel">{ this.props.submitText }</span>
          <PostIcon/>
        </button>

        <input
          className="hidden"
          onChange={ this.handleFileBrowser }
          ref="FileBrowser"
          type="file"
          capture="camera"
          accept="image/*"
        />
      </div>
    )
  }
}


export default connect()(PostActionBar)

