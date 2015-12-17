import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { addScrollObject, removeScrollObject } from '../interface/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../interface/ResizeComponent'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

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
    this.state = {
      asHidden: false,
      imageSize: 'hdpi',
      status: STATUS.PENDING,
    }
  }

  componentWillMount() {
    this.setState({ status: STATUS.REQUEST })
  }

  componentDidMount() {
    addResizeObject(this)
    addScrollObject(this)
    if (this.state.status === STATUS.REQUEST) {
      this.createLoader()
    }
  }

  componentWillReceiveProps(nextProps) {
    const thisSource = this.getCoverSource()
    const nextSource = this.getCoverSource(nextProps)
    if (thisSource !== nextSource) {
      this.setState({
        status: nextSource ? STATUS.REQUEST : STATUS.PENDING,
      })
    }
  }

  componentDidUpdate() {
    if (this.state.status === STATUS.REQUEST && !this.img) {
      this.createLoader()
    }
  }

  componentWillUnmount() {
    removeResizeObject(this)
    removeScrollObject(this)
    this.disposeLoader()
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

  getClassNames() {
    const { isModifiable, modifiers } = this.props
    const { status, asHidden } = this.state
    return classNames(
      'Cover',
      status,
      modifiers,
      { asHidden: asHidden },
      { isModifiable: isModifiable },
    )
  }

  getCoverSource(props = this.props) {
    const { coverImage } = props
    if (!coverImage) {
      return ''
    } else if (typeof coverImage === 'string') {
      return coverImage
    }
    const { imageSize } = this.state
    return coverImage[imageSize] ? coverImage[imageSize].url : null
  }

  createLoader() {
    const src = this.getCoverSource()
    this.disposeLoader()
    if (src) {
      this.img = new Image()
      this.img.onload = ::this.loadDidSucceed
      this.img.onerror = ::this.loadDidFail
      this.img.src = src
    }
  }

  disposeLoader() {
    if (this.img) {
      this.img.onload = null
      this.img.onerror = null
      this.img = null
    }
  }

  loadDidSucceed() {
    this.disposeLoader()
    this.setState({ status: STATUS.SUCCESS })
  }

  loadDidFail() {
    this.disposeLoader()
    this.setState({ status: STATUS.FAILURE })
  }

  render() {
    const src = this.getCoverSource()
    const klassNames = this.getClassNames()
    const style = src ? { backgroundImage: `url(${src})` } : null
    return (
      <div className={klassNames}>
        <figure className="CoverImage" style={style} />
      </div>
    )
  }
}

export default Cover

