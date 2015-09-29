import React from 'react'
import { RelationshipPriority } from '../buttons/RelationshipButton'

class Picker extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      hasAutoFollowed: false,
    }
  }

  // TODO: We shouldn't be calling setState here (or really at all)
  // It's a bit of rabbit hole to get the behavior we need.
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
        const personContainer = personRefs[propName].refs.wrappedInstance
        const relationshipButton = personContainer.refs.relationshipButton
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
    }
    return 'Following (' + followingLength + ')'
  }

  render() {
    return null
  }
}

Picker.defaultProps = {
  shouldAutoFollow: false,
}

Picker.propTypes = {
  shouldAutoFollow: React.PropTypes.any,
  relationshipMap: React.PropTypes.any.isRequired,
}


export default Picker

