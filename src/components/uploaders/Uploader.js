import React from 'react'
import classNames from 'classnames'
import Button from '../buttons/Button'

class Uploader extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      hasDragOver: false,
    }
  }

  triggerFileBrowser() {
    this.refs.FileBrowser.getDOMNode().click()
  }

  handleFileBrowser(e) {
    const file = e.target.files[0]
    if (file && file.type && !file.type.match(/^image/)) {
      return
    }
    this.props.saveAction(file)
  }

  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file && file.type && !file.type.match(/^image/)) {
      return
    }
    this.setState({ hasDragOver: false })
    this.props.saveAction(file)
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
      <div className={klassNames}
        onDrop={(e) => this.handleDrop(e)}
        onDragOver={(e) => this.handleDragOver(e)}
        onDragLeave={(e) => this.handleDragLeave(e)}
        >
        <Button
          onClick={(e) => this.triggerFileBrowser(e)}>
          {title}
        </Button>
        {message ? <p>{message}</p> : null}
        {recommend ? <p>{recommend}</p> : null}
        <input
          className="hidden"
          onChange={(e) => this.handleFileBrowser(e)}
          ref="FileBrowser"
          type="file"
          capture="camera"
          accept="image/*" />
      </div>
    )
  }
}

Uploader.propTypes = {
  title: React.PropTypes.string.isRequired,
  message: React.PropTypes.string,
  recommend: React.PropTypes.string,
  saveAction: React.PropTypes.func.isRequired,
}

Uploader.defaultProps = {
  title: '',
  message: null,
  recommend: null,
}

export default Uploader

