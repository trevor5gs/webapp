import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

class CoverImage extends React.Component {
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
    const { coverImage, path } = this.props
    const klassNames = classNames(
      'CoverImage',
    )
    const style = coverImage
      ? { backgroundImage: `url(${this.getImageSource(coverImage)})` }
      : null

    return (
      path
        ? <Link to={path} className={klassNames} style={style} />
        : <figure className={klassNames} style={style} />
    )
  }

}

CoverImage.propTypes = {
  coverImage: React.PropTypes.any,
  path: React.PropTypes.string,
}

export default CoverImage

