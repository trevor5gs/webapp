import React, { Component, PropTypes } from 'react'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import { StarIcon } from '../relationships/RelationshipIcons'

class StarshipButton extends Component {
  static propTypes = {
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

  constructor(props, context) {
    super(props, context)
    const { priority } = this.props
    this.state = {
      priority: priority || RELATIONSHIP_PRIORITY.INACTIVE,
    }
  }

  updatePriority(priority) {
    const { buttonWasClicked, isLoggedIn, userId } = this.props
    if (isLoggedIn) {
      this.setState({ priority: priority })
    }
    if (buttonWasClicked) {
      buttonWasClicked({ userId, priority, existing: this.state.priority })
    }
  }

  renderStar() {
    const { priority } = this.state
    const nextPriority = priority === RELATIONSHIP_PRIORITY.NOISE ?
                                      RELATIONSHIP_PRIORITY.FRIEND :
                                      RELATIONSHIP_PRIORITY.NOISE
    return (
      <button
        className={"StarshipButton"}
        onClick={() => this.updatePriority(nextPriority)}
        data-priority={priority}>
        <StarIcon/>
      </button>
    )
  }

  render() {
    const { priority } = this.state
    return priority === RELATIONSHIP_PRIORITY.SELF ? null : this.renderStar()
  }
}

export default StarshipButton

