import React from 'react'
import classNames from 'classnames'
import { MiniPlusIcon, MiniCheckIcon } from '../iconography/Icons'


class FollowButton extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { priority } = this.props
    this.state = {
      priority: priority || 'inactive',
    }
  }

  renderAsInactive(klassNames) {
    return (
      <button {...this.props}
          className={klassNames}
          type="button"
          onClick={() => this.setState({priority: 'friend'})}
          data-priority={this.state.priority}>
        <MiniPlusIcon />
        <span>Follow</span>
      </button>
    )
  }

  renderAsNone(klassNames) {
    return this.renderAsInactive(klassNames)
  }

  renderAsFriend(klassNames) {
    return (
      <button {...this.props}
          className={klassNames}
          type="button"
          onClick={() => this.setState({priority: 'inactive'})}
          data-priority={this.state.priority}>
        <MiniCheckIcon />
        <span>Friend</span>
      </button>
    )
  }

  renderAsNoise(klassNames) {
    return (
      <button {...this.props}
          className={klassNames}
          type="button"
          data-priority={this.state.priority}>
        <MiniCheckIcon />
        <span>Noise</span>
      </button>
    )
  }

  renderAsMute(klassNames) {
    return (
      <button {...this.props}
          className={klassNames}
          type="button"
          data-priority={this.state.priority}>
        <span>Muted</span>
      </button>
    )
  }

  renderAsBlock(klassNames) {
    return (
      <button {...this.props}
          className={klassNames}
          type="button"
          data-priority={this.state.priority}>
        <span>Blocked</span>
      </button>
    )
  }

  renderAsSelf() {
  }

  render() {
    const { className, classListName } = this.props
    const klassNames = classNames(className, classListName)
    const { priority } = this.state
    const fn = priority ? `renderAs${priority.charAt(0).toUpperCase() + priority.slice(1)}` : 'renderAsInactive'
    return this[fn](klassNames)
  }
}

FollowButton.defaultProps = {
  classListName: 'FollowButton',
}

FollowButton.propTypes = {
  className: React.PropTypes.string,
  classListName: React.PropTypes.string,
  priority: React.PropTypes.oneOf(['inactive', 'friend', 'noise', 'self', 'mute', 'block', 'none',  null]),
}

export default FollowButton

