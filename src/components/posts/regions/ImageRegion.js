import React from 'react'

class ImageRegion extends React.Component {

  renderAttachment() {
    const { content, key } = this.props
    let size = 'optimized'
    if (!this.attachment[size].metadata.type.match('gif')) {
      size = window.innerWidth > 375 ? 'hdpi' : 'mdpi'
    }
    return (
      <img className="ImageRegion"
        alt={content.alt}
        height={this.attachment[size].metadata.height}
        key={key}
        src={this.attachment[size].url}
        width={this.attachment[size].metadata.width} />
    )
  }

  renderContent() {
    const { content, key } = this.props
    return (
      <img className="ImageRegion"
        alt={content.alt}
        key={key}
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
  assets: React.PropTypes.object,
  content: React.PropTypes.object.isRequired,
  key: React.PropTypes.number.isRequired,
  links: React.PropTypes.object,
}

export default ImageRegion

