import React from 'react'
import { connect } from 'react-redux'
import { saveCover } from '../../actions/profile'
import Button from '../buttons/Button'

class CoverUploader extends React.Component {
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

  render() {
    return (
      <div className="CoverUploader">
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

