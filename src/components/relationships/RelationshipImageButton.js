import React from 'react'
import { Link } from 'react-router'
import RelationshipButton from '../relationships/RelationshipButton'
import { MiniPlusIcon } from '../relationships/RelationshipIcons'

class RelationshipImageButton extends RelationshipButton {

  // Override the super's `renderAsToggleButton`
  renderAsToggleButton(label, nextPriority, icon = null) {
    const { coverSrc, priority, username } = this.props
    const style = { backgroundImage: `url(${coverSrc})` }
    return (
      <button
        className="RelationshipImageButton"
        style={style}
        onClick={this.updatePriority}
        data-priority={priority}
      >
        <span className="RelationshipImageButtonUsername">{username}</span>
        <span className="RelationshipImageButtonLabels">
          {icon}
          <span>{label}</span>
        </span>
      </button>
    )
  }

  // Override the super's `renderAsLabelButton`
  renderAsLabelButton(label) {
    const { coverSrc, priority, username } = this.props
    const style = { backgroundImage: `url(${coverSrc})` }
    return (
      <button
        className="RelationshipImageButton"
        style={style}
        data-priority={priority}
      >
        <span className="RelationshipImageButtonUsername">{username}</span>
        <span className="RelationshipImageButtonLabels">
          <span>{label}</span>
        </span>
      </button>
    )
  }

  // Override the super's `renderAsSelf`
  // Need to check this still
  renderAsSelf() {
    const { coverSrc, priority, username } = this.props
    const style = { backgroundImage: `url(${coverSrc})` }
    return (
      <Link
        className="RelationshipImageButton"
        to="/settings"
        style={style}
        data-priority={priority}
      >
        <span className="RelationshipImageButtonUsername">{username}</span>
        <span className="RelationshipImageButtonLabels">
          <MiniPlusIcon />
          <span>Edit Profile</span>
        </span>
      </Link>
    )
  }
}

export default RelationshipImageButton

