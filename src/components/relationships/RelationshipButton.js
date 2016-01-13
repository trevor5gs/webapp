import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import { MiniPlusIcon, MiniCheckIcon } from '../relationships/RelationshipIcons'

// TODO: can we just use this.props and not have to set state here
class RelationshipButton extends Component {

  constructor(props, context) {
    super(props, context)
    const { priority } = this.props
    this.state = {
      priority: priority || RELATIONSHIP_PRIORITY.INACTIVE,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ priority: nextProps.priority })
  }

  buttonWasClicked(e) {
    this.updatePriority(e.target.dataset.nextPriority)
  }

  updatePriority(nextPriority) {
    const { buttonWasClicked, isLoggedIn, userId } = this.props
    if (isLoggedIn) {
      this.setState({ priority: nextPriority })
    }
    if (buttonWasClicked) {
      buttonWasClicked({ userId, priority: nextPriority, existing: this.state.priority })
    }
  }

  renderAsToggleButton(label, nextPriority, icon = null) {
    const { priority } = this.state
    return (
      <button
        className="RelationshipButton"
        onClick={::this.buttonWasClicked}
        data-priority={priority}
        data-next-priority={nextPriority}
      >
        {icon}
        <span>{label}</span>
      </button>
    )
  }

  renderAsLabelButton(label) {
    const{ buttonWasClicked } = this.props
    const { priority } = this.state
    return (
      <button
        className="RelationshipButton"
        data-priority={priority}
        onClick={ buttonWasClicked }
      >
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
        data-priority={priority}
      >
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
    const fn = priority ?
      `renderAs${priority.charAt(0).toUpperCase() + priority.slice(1)}` :
      'renderAsInactive'
    return this[fn]()
  }
}

RelationshipButton.propTypes = {
  buttonWasClicked: PropTypes.func,
  isLoggedIn: PropTypes.bool.isRequired,
  priority: PropTypes.oneOf([
    RELATIONSHIP_PRIORITY.INACTIVE,
    RELATIONSHIP_PRIORITY.FRIEND,
    RELATIONSHIP_PRIORITY.NOISE,
    RELATIONSHIP_PRIORITY.SELF,
    RELATIONSHIP_PRIORITY.MUTE,
    RELATIONSHIP_PRIORITY.BLOCK,
    RELATIONSHIP_PRIORITY.NONE,
    null,
  ]),
  userId: PropTypes.string,
}

export default RelationshipButton

