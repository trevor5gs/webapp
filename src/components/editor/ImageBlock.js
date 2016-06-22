import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import Block from './Block'


// editorId_ui: 'image name'
// { postEditor0_4: 'base64_preview' }
export const imageBlockPreviews = {}

class ImageBlock extends Component {

  static propTypes = {
    blob: PropTypes.string,
    data: PropTypes.object,
    isUploading: PropTypes.bool,
  }

  static defaultProps = {
    data: {},
  }

  onLoadImage = () => {
    const { data } = this.props
    URL.revokeObjectURL(data.src)
  }

  getImageSource() {
    const { blob, data, editorId, uid } = this.props
    const preview = imageBlockPreviews[`${editorId}_${uid}`]
    if (preview) {
      return preview
    }
    return data.url || blob
  }

  render() {
    const { blob, data, isUploading } = this.props
    return (
      <Block {...this.props}>
        <div className={classNames('editable image', { isUploading })}>
          <img
            alt={data.alt}
            onLoad={this.onLoadImage}
            src={blob || data.url}
          />
        </div>
      </Block>
    )
  }
}

export default ImageBlock

