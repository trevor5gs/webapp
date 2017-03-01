/* eslint-disable jsx-a11y/no-static-element-interactions */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import ImageAsset from '../assets/ImageAsset'
import { ElloBuyButton } from '../editor/ElloBuyButton'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

class ImageRegion extends Component {

  static propTypes = {
    asset: PropTypes.object,
    buyLinkURL: PropTypes.string,
    columnWidth: PropTypes.number,
    commentOffset: PropTypes.number,
    content: PropTypes.object.isRequired,
    contentWidth: PropTypes.number,
    detailPath: PropTypes.string.isRequired,
    innerHeight: PropTypes.number,
    isComment: PropTypes.bool,
    isGridMode: PropTypes.bool.isRequired,
    isNotification: PropTypes.bool,
  }

  static defaultProps = {
    asset: null,
    buyLinkURL: null,
    columnWidth: 0,
    commentOffset: 0,
    contentWidth: 0,
    innerHeight: 0,
    isComment: false,
    isNotification: false,
  }

  componentWillMount() {
    const { asset, innerHeight } = this.props
    let scale = null
    if (asset) {
      const imageHeight = Number(asset.getIn(['attachment', 'original', 'metadata', 'height']))
      scale = innerHeight / imageHeight
    }

    this.state = {
      marginBottom: null,
      scale: isNaN(scale) ? null : scale,
      status: STATUS.REQUEST,
    }
  }

  componentWillReceiveProps() {
    const { scale } = this.state
    if (scale) {
      this.setImageScale()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(nextProps.content, this.props.content) ||
      !Immutable.is(nextProps.asset, this.props.asset) ||
      ['buyLinkURL', 'columnWidth', 'contentWidth', 'innerHeight', 'isGridMode'].some(prop =>
        nextProps[prop] !== this.props[prop],
      ) ||
      ['marginBottom', 'scale', 'status'].some(prop => nextState[prop] !== this.state[prop])
  }

  onClickStaticImageRegion = () => {
    const { scale } = this.state
    if (scale) {
      return this.resetImageScale()
    } else if (!this.attachment) {
      return null
    }
    return this.setImageScale()
  }

  onLoadSuccess = (img) => {
    if (this.isBasicAttachment()) {
      const dimensions = this.getBasicAttachmentDimensions(img)
      this.setState({ width: dimensions.width, height: dimensions.height })
    }
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
  }

  getAttachmentMetadata() {
    if (!this.attachment || this.isBasicAttachment()) { return null }
    const optimized = this.attachment.get('optimized')
    const xhdpi = this.attachment.get('xhdpi')
    const hdpi = this.attachment.get('hdpi')
    let width = null
    let height = null

    // Todo: Not sure if we need to calculate hdpi or if xhdpi will work
    if (optimized.getIn(['metadata', 'width'])) {
      width = Number(optimized.getIn(['metadata', 'width']))
      height = Number(optimized.getIn(['metadata', 'height']))
    } else if (xhdpi.getIn(['metadata', 'width'])) {
      width = Number(xhdpi.getIn(['metadata', 'width']))
      height = Number(xhdpi.getIn(['metadata', 'height']))
    } else if (hdpi.getIn(['metadata', 'width'])) {
      width = Number(hdpi.getIn(['metadata', 'width']))
      height = Number(hdpi.getIn(['metadata', 'height']))
    }
    return {
      width,
      height,
      ratio: width ? width / height : null,
    }
  }

  // Use the lowest of the size constraints to ensure we don't go askew, go
  // below 1:1 pixel density, or go above the desired grid cell height
  getImageDimensions(metadata = this.getAttachmentMetadata()) {
    if (!metadata) { return metadata }
    const { columnWidth, commentOffset, contentWidth, isGridMode, isComment } = this.props
    const { height, ratio } = metadata
    const allowableWidth = isGridMode ? columnWidth : contentWidth
    const widthOffset = isGridMode && isComment ? commentOffset : 0
    const calculatedWidth = allowableWidth - widthOffset
    const maxCellHeight = isGridMode ? 1200 : 7500
    const widthConstrainedRelativeHeight = Math.round(calculatedWidth * (1 / ratio))
    const hv = Math.min(widthConstrainedRelativeHeight, height, maxCellHeight)
    const wv = Math.round(hv * ratio)
    return {
      width: wv,
      height: hv,
      ratio,
    }
  }

  getBasicAttachmentDimensions(img) {
    const height = img.height
    const ratio = img.width / height
    return this.getImageDimensions({ height, ratio })
  }

  getImageSourceSet() {
    const { isGridMode } = this.props
    const images = []
    if (!this.isBasicAttachment()) {
      if (isGridMode) {
        images.push(`${this.attachment.getIn(['mdpi', 'url'])} 375w`)
        images.push(`${this.attachment.getIn(['hdpi', 'url'])} 1920w`)
      } else {
        images.push(`${this.attachment.getIn(['mdpi', 'url'])} 180w`)
        images.push(`${this.attachment.getIn(['hdpi', 'url'])} 750w`)
        images.push(`${this.attachment.getIn(['xhdpi', 'url'])} 1500w`)
        images.push(`${this.attachment.getIn(['optimized', 'url'])} 1920w`)
      }
    }
    return images.join(', ')
  }

  setImageScale() {
    const dimensions = this.getImageDimensions()
    const imageHeight = dimensions.height
    const innerHeight = this.props.innerHeight - 80
    if (imageHeight && imageHeight > innerHeight) {
      this.setState({
        scale: innerHeight / imageHeight,
        marginBottom: -(imageHeight - innerHeight),
      })
    }
  }

  resetImageScale() {
    this.setState({ scale: null, marginBottom: null })
  }

  isBasicAttachment() {
    const { asset } = this.props
    return !asset || !asset.get('attachment')
  }

  isGif() {
    return this.attachment.getIn(['optimized', 'metadata', 'type']) === 'image/gif'
  }

  isVideo() {
    return this.attachment.getIn(['video'])
  }

  renderGifAttachment() {
    const { content, isNotification } = this.props
    const dimensions = this.getImageDimensions()
    return (
      <ImageAsset
        alt={content.get('alt') ? content.get('alt').replace('.gif', '') : null}
        className="ImageAttachment"
        height={isNotification ? 'auto' : dimensions.height}
        onLoadFailure={this.onLoadFailure}
        onLoadSuccess={this.onLoadSuccess}
        role="presentation"
        src={this.attachment.getIn(['optimized', 'url'])}
        width={isNotification ? null : dimensions.width}
      />
    )
  }

  renderImageAttachment() {
    const { content, isNotification } = this.props
    const srcset = this.getImageSourceSet()
    const dimensions = this.getImageDimensions()
    return (
      <ImageAsset
        alt={content.get('alt') ? content.get('alt').replace('.jpg', '') : null}
        className="ImageAttachment"
        height={isNotification ? 'auto' : dimensions.height}
        onLoadFailure={this.onLoadFailure}
        onLoadSuccess={this.onLoadSuccess}
        role="presentation"
        srcSet={srcset}
        src={this.attachment.getIn(['hdpi', 'url'])}
        width={isNotification ? null : dimensions.width}
      />
    )
  }

  renderLegacyImageAttachment() {
    const { content, isNotification } = this.props
    const attrs = { src: content.get('url') }
    const { width, height } = this.state
    const stateDimensions = width ? { width, height } : {}
    if (isNotification) {
      attrs.height = 'auto'
    }
    return (
      <ImageAsset
        alt={content.get('alt') ? content.get('alt').replace('.jpg', '') : null}
        className="ImageAttachment"
        onLoadFailure={this.onLoadFailure}
        onLoadSuccess={this.onLoadSuccess}
        role="presentation"
        {...stateDimensions}
        {...attrs}
      />
    )
  }

  renderVideoAttachment() {
    const { height, width } = this.getImageDimensions()
    return (
      <video
        autoPlay
        height={height}
        loop
        src={this.attachment.getIn(['video', 'url'])}
        width={width}
      />
    )
  }

  renderAttachment() {
    const { asset } = this.props
    if (!this.isBasicAttachment()) {
      this.attachment = asset.get('attachment')
      if (this.isVideo()) {
        return this.renderVideoAttachment()
      } else if (this.isGif()) {
        return this.renderGifAttachment()
      }
      return this.renderImageAttachment()
    }
    return this.renderLegacyImageAttachment()
  }

  renderRegionAsLink() {
    const { buyLinkURL, detailPath } = this.props
    return (
      <div className="RegionContent">
        <Link to={detailPath}>
          {this.renderAttachment()}
        </Link>
        {
          buyLinkURL && buyLinkURL.length ?
            <ElloBuyButton to={buyLinkURL} /> :
            null
        }
      </div>
    )
  }

  renderRegionAsStatic() {
    const { marginBottom, scale } = this.state
    const { buyLinkURL } = this.props
    return (
      <div
        className="RegionContent"
        onClick={this.onClickStaticImageRegion}
        style={{ transform: scale ? `scale(${scale})` : null, marginBottom }}
      >
        {this.renderAttachment()}
        {
          buyLinkURL && buyLinkURL.length ?
            <ElloBuyButton to={buyLinkURL} /> :
            null
        }
      </div>
    )
  }

  render() {
    const { isGridMode, detailPath } = this.props
    const { status } = this.state
    const asLink = isGridMode && detailPath
    return (
      <div className={classNames('ImageRegion', status)} >
        {asLink ? this.renderRegionAsLink() : this.renderRegionAsStatic()}
      </div>
    )
  }
}

export default ImageRegion

