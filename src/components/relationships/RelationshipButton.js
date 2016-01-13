import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import { MiniPlusIcon, MiniCheckIcon } from '../relationships/RelationshipIcons'

// TODO: can we just use this.props and not have to set state here
class RelationshipButton extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = { nextPriority: this.getNextPriority(this.props) }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ nextPriority: this.getNextPriority(nextProps) })
  }

  getNextPriority(props) {
    const { priority } = props
    switch (priority) {
      case RELATIONSHIP_PRIORITY.INACTIVE:
      case RELATIONSHIP_PRIORITY.NOISE:
        return RELATIONSHIP_PRIORITY.FRIEND
      default:
        return RELATIONSHIP_PRIORITY.INACTIVE
    }
  }

  updatePriority() {
    const { nextPriority } = this.state
    const { buttonWasClicked, priority, userId } = this.props
    if (buttonWasClicked) {
      buttonWasClicked({ userId, priority: nextPriority, existing: priority })
    }
  }

  renderAsToggleButton(label, icon = null) {
    const { priority } = this.props
    return (
      <button
        className="RelationshipButton"
        onClick={ ::this.updatePriority }
        data-priority={ priority }
      >
        { icon }
        <span>{ label }</span>
      </button>
    )
  }

  renderAsLabelButton(label) {
    const{ buttonWasClicked, priority } = this.props
    return (
      <button
        className="RelationshipButton"
        data-priority={ priority }
        onClick={ buttonWasClicked }
      >
        <span>{ label }</span>
      </button>
    )
  }

  renderAsSelf() {
    const { priority } = this.props
    return (
      <Link
        className="RelationshipButton"
        to="/settings"
        data-priority={ priority }
      >
        <MiniPlusIcon />
        <span>Edit Profile</span>
      </Link>
    )
  }

  renderAsInactive() {
    return this.renderAsToggleButton('Follow', <MiniPlusIcon />)
  }

  renderAsNone() {
    return this.renderAsInactive()
  }

  renderAsFriend() {
    return this.renderAsToggleButton('Following', <MiniCheckIcon />)
  }

  renderAsNoise() {
    return this.renderAsToggleButton('Starred', <MiniCheckIcon />)
  }

  renderAsMute() {
    return this.renderAsLabelButton('Muted')
  }

  renderAsBlock() {
    return this.renderAsLabelButton('Blocked')
  }

  render() {
    const { priority } = this.props
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

