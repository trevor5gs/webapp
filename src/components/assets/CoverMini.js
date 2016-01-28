import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

class CoverMini extends Component {

  componentWillMount() {
    this.state = {
      imageSize: 'hdpi',
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
      this.img.onload = this.loadDidSucceed
      this.img.onerror = this.loadDidFail
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

  loadDidSucceed = () => {
    this.disposeLoader()
    this.setState({ status: STATUS.SUCCESS })
  };

  loadDidFail = () => {
    this.disposeLoader()
    this.setState({ status: STATUS.FAILURE })
  };

  render() {
    const { to } = this.props
    const { status } = this.state
    const src = this.getCoverSource()
    const klassNames = classNames('CoverMini', status)
    const style = src ? { backgroundImage: `url(${src})` } : null

    return to ?
      <Link to={to} className={klassNames}>
        <figure className="CoverMiniImage" style={style} />
      </Link> :
      <span className={klassNames}>
        <figure className="CoverMiniImage" style={style} />
      </span>
  }
}

CoverMini.propTypes = {
  coverImage: PropTypes.any,
  to: PropTypes.string,
}

export default CoverMini

