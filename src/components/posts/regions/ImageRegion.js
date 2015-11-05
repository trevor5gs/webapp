import React from 'react'

class ImageRegion extends React.Component {

  isGif() {
    const optimized = this.attachment.optimized
    if (optimized && optimized.metadata) {
      return optimized.metadata.type === 'image/gif'
    }
    return false
  }

  renderAttachment() {
    const { content } = this.props
    let size = 'optimized'
    if (!this.isGif()) {
      size = window.innerWidth > 375 ? 'hdpi' : 'mdpi'
    }
    return (
      <img className="ImageRegion"
        alt={content.alt}
        height={this.attachment[size].metadata.height}
        src={this.attachment[size].url}
        width={this.attachment[size].metadata.width} />
    )
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
  links: React.PropTypes.object,
}

export default ImageRegion

