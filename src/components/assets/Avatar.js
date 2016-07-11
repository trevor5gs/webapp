import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import ImageAsset from './ImageAsset'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

export default class Avatar extends Component {
  static propTypes = {
    classList: PropTypes.string,
    isModifiable: PropTypes.bool,
    onClick: PropTypes.func,
    priority: PropTypes.string,
    size: PropTypes.string,
    sources: PropTypes.object,
    to: PropTypes.string,
    useGif: PropTypes.bool,
    userId: PropTypes.string,
    username: PropTypes.string,
  }

  static defaultProps = {
    classList: '',
    isModifiable: false,
    size: 'regular',
    useGif: false,
  }

  componentWillMount() {
    this.state = {
      status: this.getAvatarSource() ? STATUS.REQUEST : STATUS.PENDING,
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

  onLoadSuccess = () => {
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
  }

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
    const { sources, size, useGif } = props
    if (!sources) {
      return ''
    } else if (sources.tmp && sources.tmp.url) {
      return sources.tmp.url
    }
    if (useGif && this.isGif()) {
      return sources.original.url
    }
    return sources[size] ? sources[size].url : null
  }

  isGif() {
    return /gif$/.test(this.props.sources.original.url)
  }

  render() {
    const { onClick, priority, to, userId, username } = this.props
    const wrapperProps = {
      className: this.getClassNames(),
      'data-priority': priority || 'inactive',
      'data-userid': userId,
      'data-username': username,
      draggable: username && username.length > 1 || priority && priority.length,
    }
    const imageProps = {
      alt: username,
      className: 'AvatarImage',
      src: this.getAvatarSource(),
      onLoadFailure: this.onLoadFailure,
      onLoadSuccess: this.onLoadSuccess,
    }

    if (to) {
      return (
        <Link {...wrapperProps} to={to} >
          <ImageAsset {...imageProps} />
        </Link>
      )
    } else if (onClick) {
      return (
        <button {...wrapperProps} onClick={onClick} >
          <ImageAsset {...imageProps} />
        </button>
      )
    }
    return (
      <span {...wrapperProps} >
        <ImageAsset {...imageProps} />
      </span>
    )
  }
}

