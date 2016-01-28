import React from 'react'
import { batchUpdateRelationship } from '../../actions/relationships'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'

class Picker extends React.Component {

  componentWillMount() {
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

  getRelationshipButton() {
    return null
  }

  followAll = () => {
    const { inactive } = this.props.relationshipMap
    const userRefs = this.refs.streamComponent.refs.wrappedInstance.refs
    const relationship = inactive.length === 0 ?
      RELATIONSHIP_PRIORITY.INACTIVE :
      RELATIONSHIP_PRIORITY.FRIEND
    const userIds = []
    for (const propName in userRefs) {
      if (userRefs.hasOwnProperty(propName)) {
        const relationshipButton = this.getRelationshipButton(userRefs[propName].refs)
        if (relationshipButton) {
          userIds.push(relationshipButton.props.userId)
        }
      }
    }
    if (userIds.length) {
      const { dispatch } = this.props
      dispatch(batchUpdateRelationship(userIds, relationship))
    }
  };

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
      return `Follow All (${inactiveLength})`
    }
    return `Following (${followingLength})`
  }

  render() {
    return null
  }
}

Picker.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  relationshipMap: React.PropTypes.any.isRequired,
  shouldAutoFollow: React.PropTypes.bool,
}

Picker.defaultProps = {
  shouldAutoFollow: false,
}

export default Picker

