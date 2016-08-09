import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import Dialog from '../dialogs/Dialog'

class Uploader extends Component {

  static propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    openAlert: PropTypes.func.isRequired,
    closeAlert: PropTypes.func.isRequired,
    recommend: PropTypes.string,
    saveAction: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  static defaultProps = {
    className: '',
    message: null,
    recommend: null,
    title: '',
  }

  componentWillMount() {
    this.state = {
      hasDragOver: false,
    }
  }

  onFileBrowse = (e) => {
    const file = e.target.files[0]
    if (this.isLegitimateFileType(file)) {
      return this.props.saveAction(file)
    }
    return this.props.openAlert(
      <Dialog
        title="Invalid file type"
        body="We support .jpg, .gif, .png, or .bmp files for avatar and cover images."
        onClick={this.props.closeAlert}
      />
    )
  }

  onClickFileBrowser = () => {
    this.fileBrowser.click()
  }

  onDrop = (e) => {
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
        onDismiss={this.onDismissAlert}
      />
    )
  }

  onDragOver = (e) => {
    e.preventDefault()
    this.setState({ hasDragOver: true })
  }

  onDragLeave = (e) => {
    e.preventDefault()
    this.setState({ hasDragOver: false })
  }

  isLegitimateFileType(file) {
    return (file && file.type && file.type.match(/^image\/(jpg|jpeg|gif|png|bmp)/))
  }

  render() {
    const { className, title, message, recommend } = this.props
    const klassNames = classNames(
      'Uploader',
      className,
      { hasDragOver: this.state.hasDragOver },
    )

    return (
      <div
        className={klassNames}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
      >
        <button
          className="UploaderButton"
          onClick={this.onClickFileBrowser}
        >
          {title}
        </button>
        {message ? <p>{message}</p> : null}
        {recommend ? <p>{recommend}</p> : null}
        <input
          className="hidden"
          onChange={this.onFileBrowse}
          ref={(comp) => { this.fileBrowser = comp }}
          type="file"
          accept="image/*"
        />
      </div>
    )
  }
}

export default Uploader

