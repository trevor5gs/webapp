import React from 'react'
import { GUI } from '../../../constants/gui_types'

class ImageRegion extends React.Component {

  getAttachmentMetadata() {
    const { optimized, xhdpi, hdpi } = this.attachment
    let width = null
    let height = null

    // Todo: Not sure if we need to calculate hdpi or if xhdpi will work
    if (optimized && optimized.metadata && optimized.metadata.width) {
      width = parseInt(optimized.metadata.width, 10)
      height = parseInt(optimized.metadata.height, 10)
    } else if (xhdpi && xhdpi.metadata && xhdpi.metadata.width) {
      width = parseInt(xhdpi.metadata.width, 10)
      height = parseInt(xhdpi.metadata.height, 10)
    } else if (hdpi && hdpi.metadata && hdpi.metadata.width) {
      width = parseInt(hdpi.metadata.width, 10)
      height = parseInt(hdpi.metadata.height, 10)
    }
    return {
      width: width,
      height: height,
      ratio: width ? width / height : null,
    }
  }

  // use the lowest of the size constraints to ensure we don't go askew, go
  // below 1:1 pixel density, or go above the desired grid cell height
  getImageDimensions() {
    const metadata = this.getAttachmentMetadata()
    if (!metadata) { return metadata }
    const { isGridLayout } = this.props
    const { height, ratio } = metadata
    const columnWidth = isGridLayout ? GUI.columnWidth : GUI.contentWidth
    const maxCellHeight = isGridLayout ? 620 : 7500
    const widthConstrainedRelativeHeight = Math.round(columnWidth * (1 / ratio))
    const hv = Math.min(widthConstrainedRelativeHeight, height, maxCellHeight)
    const wv = Math.round(hv * ratio)
    return {
      width: wv,
      height: hv,
      ratio: ratio,
    }
  }

  getImageSourceSet() {
    const { isGridLayout } = this.props
    const images = []
    if (isGridLayout) {
      images.push(this.attachment.mdpi.url + ' 375w')
      images.push(this.attachment.hdpi.url + ' 1920w')
    } else {
      images.push(this.attachment.mdpi.url + ' 180w')
      images.push(this.attachment.hdpi.url + ' 750w')
      images.push(this.attachment.xhdpi.url + ' 1500w')
      images.push(this.attachment.optimized.url + ' 1920w')
    }
    return images.join(', ')
  }

  isGif() {
    const optimized = this.attachment.optimized
    if (optimized && optimized.metadata) {
      return optimized.metadata.type === 'image/gif'
    }
    return false
  }

  renderGif() {
    const { content } = this.props
    const dimensions = this.getImageDimensions()
    return (
      <img className="ImageRegion"
        alt={content.alt}
        width={dimensions.width}
        height={dimensions.height}
        src={this.attachment.optimized.url} />
    )
  }

  renderImage() {
    const { content } = this.props
    const srcset = this.getImageSourceSet()
    const dimensions = this.getImageDimensions()
    return (
      <img className="ImageRegion"
        alt={content.alt}
        width={dimensions.width}
        height={dimensions.height}
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

