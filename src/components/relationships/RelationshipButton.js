import React from 'react'
import { Link } from 'react-router'
import { MiniPlusIcon, MiniCheckIcon } from '../relationships/RelationshipIcons'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'


class RelationshipButton extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { priority } = this.props
    this.state = {
      priority: priority || RELATIONSHIP_PRIORITY.INACTIVE,
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

  renderAsToggleButton(label, nextPriority, icon = null) {
    const { priority } = this.state
    return (
      <button
        className="RelationshipButton"
        onClick={() => this.updatePriority(nextPriority)}
        data-priority={priority}>
        {icon}
        <span>{label}</span>
      </button>
    )
  }

  // This behavior is incomplete, for now it just renders a noop click label
  // for block and muting. This will need to be built out still.
  // Also @see `RelationshipImageButton` when we make changes
  renderAsLabelButton(label) {
    const { priority } = this.state
    return (
      <button
        className="RelationshipButton"
        data-priority={priority}>
        <span>{label}</span>
      </button>
    )
  }

  renderAsSelf() {
    const { priority } = this.state
    return (
      <Link
        className="RelationshipButton"
        to="/settings"
        data-priority={priority}>
        <MiniPlusIcon />
        <span>Edit Profile</span>
      </Link>
    )
  }

  renderAsInactive() {
    const nextPriority = RELATIONSHIP_PRIORITY.FRIEND
    return this.renderAsToggleButton('Follow', nextPriority, <MiniPlusIcon />)
  }

  renderAsNone() {
    return this.renderAsInactive()
  }

  renderAsFriend() {
    const nextPriority = RELATIONSHIP_PRIORITY.INACTIVE
    return this.renderAsToggleButton('Following', nextPriority, <MiniCheckIcon />)
  }

  renderAsNoise() {
    const nextPriority = RELATIONSHIP_PRIORITY.FRIEND
    return this.renderAsToggleButton('Starred', nextPriority, <MiniCheckIcon />)
  }

  renderAsMute() {
    return this.renderAsLabelButton('Muted')
  }

  renderAsBlock() {
    return this.renderAsLabelButton('Blocked')
  }

  render() {
    const { priority } = this.state
    const fn = priority ? `renderAs${priority.charAt(0).toUpperCase() + priority.slice(1)}` : 'renderAsInactive'
    return this[fn]()
  }
}

RelationshipButton.propTypes = {
  userId: React.PropTypes.string,
  buttonWasClicked: React.PropTypes.func,
  priority: React.PropTypes.oneOf([
    RELATIONSHIP_PRIORITY.INACTIVE,
    RELATIONSHIP_PRIORITY.FRIEND,
    RELATIONSHIP_PRIORITY.NOISE,
    RELATIONSHIP_PRIORITY.SELF,
    RELATIONSHIP_PRIORITY.MUTE,
    RELATIONSHIP_PRIORITY.BLOCK,
    RELATIONSHIP_PRIORITY.NONE,
    null,
  ]),
}

export default RelationshipButton

