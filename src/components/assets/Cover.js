import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { addScrollObject, removeScrollObject } from '../interface/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../interface/ResizeComponent'

class Cover extends Component {
  static propTypes = {
    coverImage: PropTypes.any,
    isModifiable: PropTypes.bool,
    modifiers: PropTypes.string,
  }

  static defaultProps = {
    modifiers: '',
  }

  constructor(props, context) {
    super(props, context)
    this.state = { asHidden: false }
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
    const { coverOffset, coverImageSize } = resizeProperties
    this.setState({ offset: coverOffset, imageSize: coverImageSize })
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
    const { coverImage, isModifiable, modifiers } = this.props
    const klassNames = classNames(
      'Cover',
      modifiers,
      { asHidden: this.state.asHidden },
      { isModifiable: isModifiable },
    )
    const style = coverImage
      ? { backgroundImage: `url(${this.getImageSource(coverImage)})` }
      : null
    return <div className={klassNames} style={style} />
  }
}

export default Cover

