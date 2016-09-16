import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Link } from 'react-router'
import classNames from 'classnames'
import ImageAsset from './ImageAsset'
import { isGif } from '../../helpers/file_helper'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

export function getSource(props) {
  const { sources, size, useGif } = props
  if (!sources) {
    return ''
  } else if (sources.tmp && sources.tmp.url) {
    return sources.tmp.url
  } else if (useGif && isGif(sources.original.url)) {
    return sources.original.url
  }
  return sources[size] ? sources[size].url : null
}

export default class Avatar extends Component {
  static propTypes = {
    alt: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    priority: PropTypes.string,
    to: PropTypes.string,
    userId: PropTypes.string,
    username: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    size: 'regular',
    useGif: false,
  }

  componentWillMount() {
    this.state = {
      status: getSource(this.props) ? STATUS.REQUEST : STATUS.PENDING,
    }
  }

  componentWillReceiveProps(nextProps) {
    const thisSource = getSource(this.props)
    const nextSource = getSource(nextProps)
    if (thisSource !== nextSource) {
      this.setState({
        status: nextSource ? STATUS.REQUEST : STATUS.PENDING,
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onLoadSuccess = () => {
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
  }

  render() {
    const { alt, className, onClick, priority, to, userId, username } = this.props
    const { status } = this.state
    const wrapperProps = {
      className: classNames('Avatar', className, status),
      'data-priority': priority || 'inactive',
      'data-userid': userId,
      'data-username': username,
      draggable: (username && username.length > 1) || (priority && priority.length),
    }
    const imageProps = {
      alt: alt || username,
      className: 'AvatarImage',
      src: getSource(this.props),
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

