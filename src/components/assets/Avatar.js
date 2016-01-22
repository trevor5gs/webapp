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

  constructor(props, context) {
    super(props, context)
    this.state = {
      status: this.getAvatarSource() ? STATUS.REQUEST : STATUS.PENDING,
    }
    this.loadDidFail = ::this.loadDidFail
    this.loadDidSucceed = ::this.loadDidSucceed
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

  getClassNames() {
    const { isModifiable, size } = this.props
    const { status } = this.state
    return classNames(
      'Avatar',
       size !== 'regular' ? size : null,
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

  loadDidSucceed() {
    this.disposeLoader()
    this.setState({ status: STATUS.SUCCESS })
  }

  loadDidFail() {
    this.disposeLoader()
    this.setState({ status: STATUS.FAILURE })
  }

  render() {
    const { to } = this.props
    const src = this.getAvatarSource()
    const klassNames = this.getClassNames()
    const style = src ? { backgroundImage: `url(${src})` } : null

    return to ?
      <Link to={to} className={klassNames}>
        <div className="AvatarImage" style={style} />
      </Link> :
      <span className={klassNames}>
        <div className="AvatarImage" style={style} />
      </span>
  }
}

Avatar.propTypes = {
  isModifiable: PropTypes.bool,
  size: PropTypes.string,
  sources: PropTypes.object,
  to: PropTypes.string,
}

Avatar.defaultProps = {
  isModifiable: false,
  size: 'regular',
}

export default Avatar

