import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

class CoverImage extends Component {
  static propTypes = {
    coverImage: PropTypes.any,
    to: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      imageSize: 'hdpi',
    }
  }

  getImageSource(coverImage) {
    if (!coverImage) {
      return ''
    } else if (typeof coverImage === 'string') {
      return coverImage
    }
    const { imageSize } = this.state
    return coverImage[imageSize] ? coverImage[imageSize].url : coverImage.optimized.url
  }

  render() {
    const { coverImage, to } = this.props
    const klassNames = classNames(
      'CoverImage',
    )
    const style = coverImage
      ? { backgroundImage: `url(${this.getImageSource(coverImage)})` }
      : null

    return (
      to
        ? <Link to={to} className={klassNames} style={style} />
        : <figure className={klassNames} style={style} />
    )
  }
}

export default CoverImage

