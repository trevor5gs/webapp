import React from 'react'
import classNames from 'classnames'
import { addScrollObject, removeScrollObject } from '../interface/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../interface/ResizeComponent'

class Cover extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      asHidden: false,
      imageSize: 'optimized',
      offset: Math.round((window.innerWidth * 0.5625)),
    }
  }

  componentDidMount() {
    addResizeObject(this)
    addScrollObject(this)
  }

  componentWillUnmount() {
    removeResizeObject(this)
    removeScrollObject(this)
  }

  onResize(resizeProperties) {
    const { coverOffset, windowWidth } = resizeProperties
    const size = this.getImageSize(windowWidth)
    this.setState({ offset: coverOffset, imageSize: size })
  }

  onScroll(scrollProperties) {
    const { scrollY } = scrollProperties
    const { offset, asHidden } = this.state
    if (scrollY >= offset && !asHidden) {
      return this.setState({ asHidden: true })
    } else if (scrollY < offset && asHidden) {
      return this.setState({ asHidden: false })
    }
  }

  getImageSize(windowWidth) {
    if (windowWidth < 1500) {
      return 'hdpi'
    } else if (windowWidth >= 1500 && windowWidth < 1920) {
      return 'xhdpi'
    }
    return 'optimized'
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
    const { coverImage, isModifiable } = this.props
    const klassNames = classNames(
      'Cover',
      { asHidden: this.state.asHidden },
      { isModifiable: isModifiable },
    )
    const style = coverImage
      ? { backgroundImage: `url(${this.getImageSource(coverImage)})` }
      : null
    return <div className={klassNames} style={style} />
  }
}

Cover.propTypes = {
  coverImage: React.PropTypes.any,
  isModifiable: React.PropTypes.any,
}

export default Cover

