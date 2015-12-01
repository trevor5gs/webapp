import React from 'react'
import StreamComponent from '../../streams/StreamComponent'

class ImageRegion extends React.Component {

  isGif() {
    const optimized = this.attachment.optimized
    if (optimized && optimized.metadata) {
      return optimized.metadata.type === 'image/gif'
    }
    return false
  }

  renderGif() {
    const { content } = this.props
    return (
      <img className="ImageRegion"
        alt={content.alt}
        height={this.attachment.optimized.metadata.height}
        src={this.attachment.optimized.url}
        width={this.attachment.optimized.metadata.width} />
    )
  }

  renderImage() {
    const { content, isGridLayout } = this.props
    const sizes = []
    if (isGridLayout) {
      sizes.push(this.attachment.mdpi.url + ' 375w')
      sizes.push(this.attachment.hdpi.url + ' 1920w')
    } else {
      sizes.push(this.attachment.mdpi.url + ' 180w')
      sizes.push(this.attachment.hdpi.url + ' 750w')
      sizes.push(this.attachment.xhdpi.url + ' 1500w')
      sizes.push(this.attachment.optimized.url + ' 1920w')
    }
    let height = parseInt(this.attachment.optimized.metadata.height, 10)
    const width = parseInt(this.attachment.optimized.metadata.width, 10)

    const ratio = width / height
    height = Math.round(window.columnWidth / ratio)


    const srcset = sizes.join(', ')
    return (
      <img className="ImageRegion"
        alt={content.alt}
        height={height}
        width={window.columnWidth}
        src={this.attachment.hdpi.url}
        srcSet={srcset} />
    )
  }

  renderAttachment() {
    if (this.isGif()) {
      return this.renderGif()
    }
    return this.renderImage()
  }

  renderContent() {
    const { content } = this.props
    return (
      <img className="ImageRegion"
        alt={content.alt}
        src={content.url} />
    )
  }

  render() {
    const { assets, links } = this.props
    if (links && links.assets && assets[links.assets] && assets[links.assets].attachment) {
      this.attachment = assets[links.assets].attachment
      return this.renderAttachment()
    }
    return this.renderContent()
  }
}

ImageRegion.propTypes = {
  assets: React.PropTypes.object.isRequired,
  content: React.PropTypes.object.isRequired,
  isGridLayout: React.PropTypes.bool.isRequired,
  links: React.PropTypes.object,
}

export default ImageRegion

