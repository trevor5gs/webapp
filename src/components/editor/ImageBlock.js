import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import Block from './Block'
import ImageAsset from '../assets/ImageAsset'

export default class ImageBlock extends Component {

  static propTypes = {
    blob: PropTypes.string,
    data: PropTypes.object,
    isUploading: PropTypes.bool,
  }

  static defaultProps = {
    data: {},
  }

  onLoadSuccess = () => {
    const { data } = this.props
    URL.revokeObjectURL(data.src)
  }

  render() {
    const { blob, data, isUploading } = this.props
    return (
      <Block {...this.props}>
        <div className={classNames('editable image', { isUploading })}>
          <ImageAsset
            alt={data.alt}
            onLoadSuccess={this.onLoadSuccess}
            src={blob || data.url}
          />
        </div>
      </Block>
    )
  }
}

