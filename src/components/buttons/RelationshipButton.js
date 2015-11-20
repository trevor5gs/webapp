import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { MiniPlusIcon, MiniCheckIcon } from '../users/UserIcons'


export const RelationshipPriority = {
  INACTIVE: 'inactive',
  FRIEND: 'friend',
  NOISE: 'noise',
  SELF: 'self',
  MUTE: 'mute',
  BLOCK: 'block',
  NONE: 'none',
}

class RelationshipButton extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { priority } = this.props
    this.state = {
      priority: priority || RelationshipPriority.INACTIVE,
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
          onClick={() => this.updatePriority(RelationshipPriority.INACTIVE)}
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

  renderAsSelf(klassNames) {
    return (
      <Link {...this.props}
          className={klassNames}
          to="/settings"
          data-priority={this.state.priority}>
        <MiniPlusIcon />
        <span>Edit Profile</span>
      </Link>
    )
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
  priority: React.PropTypes.oneOf([
    RelationshipPriority.INACTIVE,
    RelationshipPriority.FRIEND,
    RelationshipPriority.NOISE,
    RelationshipPriority.SELF,
    RelationshipPriority.MUTE,
    RelationshipPriority.BLOCK,
    RelationshipPriority.NONE,
    null,
  ]),
}

export default RelationshipButton

