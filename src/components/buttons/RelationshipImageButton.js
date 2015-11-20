import React from 'react'
import classNames from 'classnames'
import RelationshipButton from './RelationshipButton'
import { MiniPlusIcon, MiniCheckIcon } from '../users/UserIcons'


class RelationshipImageButton extends RelationshipButton {
  renderAsInactive(klassNames, label) {
    return (
      <button {...this.props}
          className={klassNames}
          type="button"
          onClick={() => this.updatePriority('friend')}
          data-priority={this.state.priority}>
        <span>{label}</span>
        <span>
          <MiniPlusIcon />
          <span>Follow</span>
        </span>
      </button>
    )
  }

  renderAsNone(klassNames, label) {
    return this.renderAsInactive(klassNames, label)
  }

  renderAsFriend(klassNames, label) {
    return (
      <button {...this.props}
          className={klassNames}
          type="button"
          onClick={() => this.updatePriority('inactive')}
          data-priority={this.state.priority}>
        <span>{label}</span>
        <span>
            <MiniCheckIcon />
            <span>Following</span>
        </span>
      </button>
    )
  }

  renderAsNoise(klassNames, label) {
    return (
      <button {...this.props}
          className={klassNames}
          type="button"
          data-priority={this.state.priority}>
        <span>{label}</span>
        <span>
          <MiniCheckIcon />
          <span>Starred</span>
        </span>
      </button>
    )
  }

  renderAsMute(klassNames, label) {
    return (
      <button {...this.props}
          className={klassNames}
          type="button"
          data-priority={this.state.priority}>
        <span>{label}</span>
        <span>Muted</span>
      </button>
    )
  }

  renderAsBlock(klassNames, label) {
    return (
      <button {...this.props}
          className={klassNames}
          type="button"
          data-priority={this.state.priority}>
        <span>{label}</span>
        <span>Blocked</span>
      </button>
    )
  }

  renderAsSelf() {
  }

  render() {
    const { className, classListName, label } = this.props
    const klassNames = classNames(className, classListName)
    const { priority } = this.state
    const fn = priority ? `renderAs${priority.charAt(0).toUpperCase() + priority.slice(1)}` : 'renderAsInactive'
    return this[fn](klassNames, label)
  }
}

RelationshipImageButton.defaultProps = {
  classListName: 'RelationshipImageButton',
}

export default RelationshipImageButton

