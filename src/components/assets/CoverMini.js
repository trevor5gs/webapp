import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import ImageAsset from '../assets/ImageAsset'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

export default class CoverMini extends Component {

  static propTypes = {
    coverImage: PropTypes.any,
    to: PropTypes.string,
  }

  componentWillMount() {
    this.state = {
      imageSize: 'xhdpi',
      status: STATUS.REQUEST,
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

  onLoadSuccess = () => {
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
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

  render() {
    const { to } = this.props
    const { status } = this.state
    const classList = classNames('CoverMini', status)
    const imageProps = {
      className: 'CoverMiniImage',
      isBackgroundImage: true,
      onLoadFailure: this.onLoadFailure,
      onLoadSuccess: this.onLoadSuccess,
      src: this.getCoverSource(),
    }

    return to ?
      <Link to={to} className={classList}>
        <ImageAsset {...imageProps} />
      </Link> :
      <span className={classList}>
        <ImageAsset {...imageProps} />
      </span>
  }
}

