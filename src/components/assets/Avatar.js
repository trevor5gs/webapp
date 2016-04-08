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
  }

  onLoadFailure = () => {
    this.disposeLoader()
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
    const { onClick, priority, to, userId, username } = this.props
    const src = this.getAvatarSource()
    const klassNames = this.getClassNames()
    const isDraggable = username && username.length > 1 || priority && priority.length
    if (to) {
      return (
        <Link
          className={ klassNames }
          data-priority={ priority || 'inactive' }
          data-userid={ userId }
          data-username={ username }
          to={ to }
          draggable={ isDraggable }
        >
          <img className="AvatarImage" src={ src } />
        </Link>
      )
    } else if (onClick) {
      return (
        <button
          className={ klassNames }
          data-priority={ priority || 'inactive' }
          data-userid={ userId }
          data-username={ username }
          onClick={ onClick }
          draggable={ isDraggable }
        >
          <img className="AvatarImage" src={ src } />
        </button>
      )
    }
    return (
      <span
        className={ klassNames }
        data-priority={ priority || 'inactive' }
        data-userid={ userId }
        data-username={ username }
        draggable={ isDraggable }
      >
        <img className="AvatarImage" src={ src } />
      </span>
    )
  }
}

export default Avatar

