import React, { Component, PropTypes } from 'react'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import { StarIcon } from '../relationships/RelationshipIcons'

class StarshipButton extends Component {

  componentWillMount() {
    this.state = { nextPriority: this.getNextPriority(this.props) }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ nextPriority: this.getNextPriority(nextProps) })
  }

  getNextPriority(props) {
    const { priority } = props
    switch (priority) {
      case RELATIONSHIP_PRIORITY.NOISE:
        return RELATIONSHIP_PRIORITY.FRIEND
      default:
        return RELATIONSHIP_PRIORITY.NOISE
    }
  }

  updatePriority = () => {
    const { nextPriority } = this.state
    const { buttonWasClicked, priority, userId } = this.props
    if (buttonWasClicked) {
      buttonWasClicked({ userId, priority: nextPriority, existing: priority })
    }
  };

  renderStar() {
    const { priority } = this.props
    return (
      <button
        className={"StarshipButton"}
        onClick={ this.updatePriority }
        data-priority={priority}
      >
        <StarIcon/>
      </button>
    )
  }

  render() {
    const { priority } = this.props
    return priority === RELATIONSHIP_PRIORITY.SELF ? null : this.renderStar()
  }
}

StarshipButton.propTypes = {
  buttonWasClicked: PropTypes.func,
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

export default StarshipButton

