import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

class Avatar extends Component {

  static propTypes = {
    classList: PropTypes.string,
    isModifiable: PropTypes.bool,
    onClick: PropTypes.func,
    size: PropTypes.string,
    sources: PropTypes.object,
    to: PropTypes.string,
  };

  static defaultProps = {
    classList: '',
    isModifiable: false,
    size: 'regular',
  };

  componentWillMount() {
    this.state = {
      status: this.getAvatarSource() ? STATUS.REQUEST : STATUS.PENDING,
    }
  }

  componentDidMount() {
    if (this.state.status === STATUS.REQUEST) {
      this.createLoader()
    }
  }

  componentWillReceiveProps(nextProps) {
    const thisSource = this.getAvatarSource()
    const nextSource = this.getAvatarSource(nextProps)
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
  };

  onLoadFailure = () => {
    this.disposeLoader()
    this.setState({ status: STATUS.FAILURE })
  };

  getClassNames() {
    const { classList, isModifiable, size } = this.props
    const { status } = this.state
    return classNames(
      'Avatar',
      size !== 'regular' ? size : null,
      classList,
      status,
      { isModifiable },
    )
  }

  getAvatarSource(props = this.props) {
    const { sources, size } = props
    if (!sources) {
      return ''
    } else if (sources.tmp && sources.tmp.url) {
      return sources.tmp.url
    }
    return sources[size] ? sources[size].url : null
  }

  createLoader() {
    const src = this.getAvatarSource()
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
    const { onClick, to } = this.props
    const src = this.getAvatarSource()
    const klassNames = this.getClassNames()
    const style = src ? { backgroundImage: `url(${src})` } : null
    if (to) {
      return (
        <Link className={klassNames} to={to}>
          <div className="AvatarImage" style={style} />
        </Link>
      )
    } else if (onClick) {
      return (
        <button className={klassNames} onClick={ onClick }>
          <div className="AvatarImage" style={style} />
        </button>
      )
    }
    return (
      <span className={klassNames}>
        <div className="AvatarImage" style={style} />
      </span>
    )
  }
}

export default Avatar

