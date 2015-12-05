import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

class Avatar extends Component {
  static propTypes = {
    isModifiable: PropTypes.bool,
    size: PropTypes.string,
    sources: PropTypes.any,
    to: PropTypes.string,
  }

  static defaultProps = {
    isModifiable: false,
    size: 'regular',
  }

  getAvatarSource() {
    const { sources, size } = this.props
    if (!sources) {
      return ''
    } else if (typeof sources === 'string') {
      return sources
    }
    return sources[size] ? sources[size].url : ''
  }

  render() {
    const { to, isModifiable } = this.props
    const src = this.getAvatarSource()
    const klassNames = classNames(
      'Avatar',
      { isModifiable: isModifiable },
    )
    if (to) {
      return (
        <Link to={to} className={klassNames}>
          <img className="AvatarImage" src={src}></img>
        </Link>
      )
    }
    return (
      <span className={klassNames}>
        <img className="AvatarImage" src={src}></img>
      </span>
    )
  }
}

export default Avatar

