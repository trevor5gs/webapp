import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

class Avatar extends React.Component {
  static propTypes = {
    sources: React.PropTypes.any,
    size: React.PropTypes.string,
    to: React.PropTypes.string,
    isModifiable: React.PropTypes.any,
  }

  static defaultProps = {
    size: 'regular',
    isModifiable: false,
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

