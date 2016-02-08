import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { openAlert } from '../../actions/modals'
import { closeOmnibar } from '../../actions/omnibar'
import { savePostImage } from '../../actions/posts'
import Dialog from '../../components/dialogs/Dialog'

class PostActionBar extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    editor: PropTypes.any.isRequired,
  };

  submitted = () => {
    const { editor } = this.props
    editor.submit()
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
    this.props.dispatch(closeOmnibar())
  };

  render() {
    return (
      <div className="editor-actions">
        <button ref="browseButton" onClick={ this.browse } name="browse-button">Upload</button>
        <button ref="cancelButton" onClick={ this.cancel } name="cancel-button">Cancel</button>
        <button ref="submitButton" onClick={ this.submitted } name="submit-button">Post</button>
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

