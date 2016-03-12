import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import {
  HeaderPlusIcon,
  HeaderCheckIcon,
  MiniPlusIcon,
  MiniCheckIcon,
} from '../relationships/RelationshipIcons'

class RelationshipButton extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    classList: PropTypes.string,
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
    userId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }

  componentWillMount() {
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
      case RELATIONSHIP_PRIORITY.NONE:
      case null:
        return RELATIONSHIP_PRIORITY.FRIEND
      default:
        return RELATIONSHIP_PRIORITY.INACTIVE
    }
  }

  updatePriority = () => {
    const { nextPriority } = this.state
    const { onClick, priority, userId } = this.props
    if (onClick) {
      onClick({ userId, priority: nextPriority, existing: priority })
    }
  }

  renderAsToggleButton(label, icon = null) {
    const { classList, priority } = this.props
    return (
      <button
        className={ classNames('RelationshipButton', classList) }
        onClick={ this.updatePriority }
        data-priority={ priority }
      >
        { icon }
        <span>{ label }</span>
      </button>
    )
  }

  renderAsLabelButton(label) {
    const { onClick, priority, classList } = this.props
    return (
      <button
        className={ classNames('RelationshipButton', classList) }
        data-priority={ priority }
        onClick={ onClick }
      >
        <span>{ label }</span>
      </button>
    )
  }

  renderAsSelf() {
    const { priority, classList } = this.props
    return (
      <Link
        className={ classNames('RelationshipButton', classList) }
        to="/settings"
        data-priority={ priority }
      >
        { classList === 'inHeader' ? <HeaderPlusIcon /> : <MiniPlusIcon /> }
        <span>Edit Profile</span>
      </Link>
    )
  }

  renderAsInactive() {
    const icon = this.props.classList === 'inHeader' ? <HeaderPlusIcon /> : <MiniPlusIcon />
    return this.renderAsToggleButton('Follow', icon)
  }

  renderAsNone() {
    return this.renderAsInactive()
  }

  renderAsFriend() {
    const icon = this.props.classList === 'inHeader' ? <HeaderCheckIcon /> : <MiniCheckIcon />
    return this.renderAsToggleButton('Following', icon)
  }

  renderAsNoise() {
    const icon = this.props.classList === 'inHeader' ? <HeaderCheckIcon /> : <MiniCheckIcon />
    return this.renderAsToggleButton('Starred', icon)
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

export default RelationshipButton

