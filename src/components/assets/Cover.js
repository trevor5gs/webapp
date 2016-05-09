import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

class Cover extends Component {

  static propTypes = {
    coverImage: PropTypes.object,
    coverImageSize: PropTypes.string,
    coverOffset: PropTypes.number,
    isHidden: PropTypes.bool,
    isModifiable: PropTypes.bool,
    modifiers: PropTypes.string,
    useGif: PropTypes.bool,
  }

  static defaultProps = {
    modifiers: '',
    useGif: false,
    coverImageSize: 'xhdpi',
    isHidden: false,
  }

  componentWillMount() {
    this.state = {
      status: STATUS.REQUEST,
    }
  }

  componentDidMount() {
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
    this.disposeLoader()
  }

  onLoadSuccess = () => {
    this.disposeLoader()
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.disposeLoader()
    this.setState({ status: STATUS.FAILURE })
  }

  getClassNames() {
    const { isHidden, isModifiable, modifiers } = this.props
    const { status } = this.state
    return classNames(
      'Cover',
      status,
      modifiers,
      { isHidden },
      { isModifiable },
    )
  }

  getCoverSource(props = this.props) {
    const { coverImage, coverImageSize, useGif } = props
    if (!coverImage) {
      return ''
    } else if (coverImage.tmp && coverImage.tmp.url) {
      return coverImage.tmp.url
    }
    if (useGif && this.isGif()) {
      return coverImage.original.url
    }
    return coverImage[coverImageSize] ? coverImage[coverImageSize].url : null
  }

  isGif() {
    return /gif$/.test(this.props.coverImage.original.url)
  }

  createLoader() {
    const src = this.getCoverSource()
    this.disposeLoader()
    if (src) {
      this.img = new Image()
      this.img.onload = this.onLoadSuccess
      this.img.onerror = this.onLoadFailure
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

  render() {
    const src = this.getCoverSource()
    const klassNames = this.getClassNames()
    const style = src ? { backgroundImage: `url(${src})` } : null
    return (
      <div className={ klassNames }>
        <figure className="CoverImage" style={ style } />
      </div>
    )
  }
}

export default Cover

