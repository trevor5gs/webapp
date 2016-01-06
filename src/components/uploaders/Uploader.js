import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import Dialog from '../dialogs/Dialog'

class Uploader extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      hasDragOver: false,
    }
  }

  triggerFileBrowser() {
    this.refs.FileBrowser.click()
  }

  isLegitimateFileType(file) {
    return (file && file.type && file.type.match(/^image\/(jpg|jpeg|gif|png|tiff|tif|bmp)/))
  }

  handleFileBrowser(e) {
    const file = e.target.files[0]
    if (this.isLegitimateFileType(file)) {
      return this.props.saveAction(file)
    }
    return this.props.openAlert(
      <Dialog
        title="Invalid file type"
        body="We support .jpg, .gif, .png, or .bmp files for avatar and cover images."
      />
    )
  }

  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (this.isLegitimateFileType(file)) {
      this.setState({ hasDragOver: false })
      return this.props.saveAction(file)
    }
    return this.props.openAlert(
      <Dialog
        title="Invalid file type"
        body="We support .jpg, .gif, .png, or .bmp files for avatar and cover images."
      />
    )
  }

  handleDragOver(e) {
    e.preventDefault()
    this.setState({ hasDragOver: true })
  }

  handleDragLeave(e) {
    e.preventDefault()
    this.setState({ hasDragOver: false })
  }

  render() {
    const { title, message, recommend } = this.props
    const klassNames = classNames(
      'Uploader',
      { hasDragOver: this.state.hasDragOver },
    )

    return (
      <div
        className={klassNames}
        onDrop={::this.handleDrop}
        onDragOver={::this.handleDragOver}
        onDragLeave={::this.handleDragLeave}
      >
        <button
          className="UploaderButton"
          onClick={::this.triggerFileBrowser}
        >
          {title}
        </button>
        {message ? <p>{message}</p> : null}
        {recommend ? <p>{recommend}</p> : null}
        <input
          className="hidden"
          onChange={::this.handleFileBrowser}
          ref="FileBrowser"
          type="file"
          capture="camera"
          accept="image/*"
        />
      </div>
    )
  }
}

Uploader.propTypes = {
  message: PropTypes.string,
  openAlert: PropTypes.func.isRequired,
  recommend: PropTypes.string,
  saveAction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

Uploader.defaultProps = {
  message: null,
  recommend: null,
  title: '',
}

export default Uploader

