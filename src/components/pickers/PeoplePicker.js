import React from 'react'
import classNames from 'classnames'
import { loadAwesomePeople } from '../../actions/onboarding'
import StreamComponent from '../streams/StreamComponent'
import Button from '../buttons/Button'
import { RelationshipPriority } from '../buttons/RelationshipButton'

class PeoplePicker extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      hasAutoFollowed: false,
    }
  }

  componentDidUpdate() {
    const { shouldAutoFollow, relationshipMap } = this.props
    if (!this.state.hasAutoFollowed && shouldAutoFollow && relationshipMap.inactive.length > 0) {
      this.setState({ hasAutoFollowed: true })
      requestAnimationFrame(() => {
        this.followAll()
      })
    }
  }

  followAll() {
    const { inactive } = this.props.relationshipMap
    const personRefs = this.refs.streamComponent.refs.wrappedInstance.refs
    const relationship = inactive.length === 0 ? RelationshipPriority.INACTIVE : RelationshipPriority.FRIEND
    for (const propName in personRefs) {
      if (personRefs.hasOwnProperty(propName)) {
        const personGrid = personRefs[propName].refs.wrappedInstance
        const relationshipButton = personGrid.refs.relationshipButton
        relationshipButton.updatePriority(relationship.priority)
      }
    }
  }

  isFollowingAll() {
    const { following, inactive } = this.props.relationshipMap
    return following.length > 1 && inactive.length === 0 ? true : false
  }

  renderBigButtonText() {
    const { following, inactive } = this.props.relationshipMap
    const followingLength = following.length
    const inactiveLength = inactive.length
    if (followingLength === 0 && inactiveLength === 0) {
      return ''
    } else if (followingLength === 0) {
      return 'Follow All (' + inactiveLength + ')'
    // } else if (followingLength > 0 && inactiveLength > 0) {
    //   return 'Follow Remaining (' +  inactiveLength + ')'
    }
    return 'Following (' + followingLength + ')'
  }

  render() {
    return (
      <div className={classNames('PeoplePicker', 'Panel', {isFollowingAll: this.isFollowingAll()})}>
        <Button ref="followAllButton" onClick={() => this.followAll()}>
          <span>{this.renderBigButtonText()}</span>
        </Button>
        <StreamComponent ref="streamComponent" action={loadAwesomePeople} />
      </div>
    )
  }
}

PeoplePicker.defaultProps = {
  shouldAutoFollow: false,
}

PeoplePicker.propTypes = {
  shouldAutoFollow: React.PropTypes.any,
  relationshipMap: React.PropTypes.any.isRequired,
}

export default PeoplePicker

