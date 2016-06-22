import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

// Used for temporary base64 assets
export const coverPreview = null

class Cover extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    coverImage: PropTypes.object,
    coverOffset: PropTypes.number,
    isHidden: PropTypes.bool,
    isModifiable: PropTypes.bool,
    modifiers: PropTypes.string,
    useGif: PropTypes.bool,
  }

  static defaultProps = {
    coverDPI: 'xhdpi',
    isHidden: false,
    modifiers: '',
    useGif: false,
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
    const { coverDPI, coverImage, isModifiable, useGif } = props
    if (isModifiable && coverPreview) {
      return coverPreview
    }
    if (!coverImage) {
      return ''
    } else if (coverImage.tmp && coverImage.tmp.url) {
      return coverImage.tmp.url
    }
    if (useGif && this.isGif()) {
      return coverImage.original.url
    }
    return coverImage[coverDPI] ? coverImage[coverDPI].url : null
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
      <div className={klassNames}>
        <figure className="CoverImage" style={style} />
      </div>
    )
  }
}

export default Cover

