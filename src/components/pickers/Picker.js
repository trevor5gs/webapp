import React from 'react'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'

class Picker extends React.Component {
  static propTypes = {
    relationshipMap: React.PropTypes.any.isRequired,
    shouldAutoFollow: React.PropTypes.bool,
  }

  static defaultProps = {
    shouldAutoFollow: false,
  }

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
    const relationship = inactive.length === 0 ? RELATIONSHIP_PRIORITY.INACTIVE : RELATIONSHIP_PRIORITY.FRIEND
    for (const propName in userRefs) {
      if (userRefs.hasOwnProperty(propName)) {
        const userContainer = userRefs[propName].refs.wrappedInstance
        if (userContainer) {
          const relationshipButton = userContainer.refs.relationshipButton
          relationshipButton.updatePriority(relationship)
        }
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

export default Picker

