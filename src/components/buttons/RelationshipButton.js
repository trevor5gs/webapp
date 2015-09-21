import React from 'react'
import classNames from 'classnames'
import { MiniPlusIcon, MiniCheckIcon } from '../iconography/Icons'


export const RelationshipPriority = {
  INACTIVE: { priority: 'inactive' },
  FRIEND: { priority: 'friend' },
  NOISE: { priority: 'noise' },
  SELF: { priority: 'self' },
  MUTE: { priority: 'mute' },
  BLOCK: { priority: 'block' },
  NONE: { priority: 'none' },
}

class RelationshipButton extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { priority } = this.props
    this.state = {
      priority: priority || 'inactive',
    }
  }

  updatePriority(priority) {
    const { buttonWasClicked, userId } = this.props
    if (buttonWasClicked) {
      buttonWasClicked({ userId, priority, existing: this.state.priority })
    }
    // Render the state change instantly
    this.setState({ priority: priority })
  }

  renderAsInactive(klassNames) {
    return (
      <button {...this.props}
          className={klassNames}
          type="button"
          onClick={() => this.updatePriority('friend')}
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
          onClick={() => this.updatePriority('inactive')}
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

RelationshipButton.defaultProps = {
  classListName: 'RelationshipButton',
}

RelationshipButton.propTypes = {
  className: React.PropTypes.string,
  classListName: React.PropTypes.string,
  userId: React.PropTypes.string,
  buttonWasClicked: React.PropTypes.func,
  priority: React.PropTypes.oneOf(['inactive', 'friend', 'noise', 'self', 'mute', 'block', 'none',  null]),
}

export default RelationshipButton

