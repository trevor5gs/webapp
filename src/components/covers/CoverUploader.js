import React from 'react'
import { connect } from 'react-redux'
import { saveCover } from '../../actions/profile'
import classNames from 'classnames'
import Button from '../buttons/Button'

class CoverUploader extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      hasDragOver: false,
    }
  }

  triggerFileBrowser() {
    this.refs.CoverFileBrowser.getDOMNode().click()
  }

  handleFileBrowser(e) {
    const file = e.target.files[0]
    if (!file.type.match(/^image/)) {
      return
    }
    this.props.dispatch(saveCover(file))
  }

  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file && file.type && !file.type.match(/^image/)) {
      return
    }
    this.setState({ hasDragOver: false })
    this.props.dispatch(saveCover(file))
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
    const klassNames = classNames(
      'CoverUploader',
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
          Upload a header image
        </Button>
        <p>Or drag & drop</p>
        <p>Recommended image size: 2560 x 1440</p>
        <input
          className="hidden"
          onChange={(e) => this.handleFileBrowser(e)}
          ref="CoverFileBrowser"
          type="file"
          capture="camera"
          accept="image/*" />
      </div>
    )
  }
}

CoverUploader.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
}

export default connect()(CoverUploader)

