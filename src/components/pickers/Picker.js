import React from 'react'
import { RelationshipPriority } from '../buttons/RelationshipButton'

class Picker extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.hasAutoFollowed = false
  }

  componentDidUpdate() {
    const { shouldAutoFollow, relationshipMap } = this.props
    if (!this.hasAutoFollowed && shouldAutoFollow && relationshipMap.inactive.length > 0) {
      this.hasAutoFollowed = true
      requestAnimationFrame(() => {
        this.followAll()
      })
    }
  }

  followAll() {
    const { inactive } = this.props.relationshipMap
    const userRefs = this.refs.streamComponent.refs.wrappedInstance.refs
    const relationship = inactive.length === 0 ? RelationshipPriority.INACTIVE : RelationshipPriority.FRIEND
    for (const propName in userRefs) {
      if (userRefs.hasOwnProperty(propName)) {
        const userContainer = userRefs[propName].refs.wrappedInstance
        const relationshipButton = userContainer.refs.relationshipButton
        relationshipButton.updatePriority(relationship)
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

