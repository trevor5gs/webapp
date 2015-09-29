import React from 'react'
import Picker from './Picker'
import classNames from 'classnames'
import { loadCommunities } from '../../actions/onboarding'
import StreamComponent from '../streams/StreamComponent'
import Button from '../buttons/Button'
// import { RelationshipPriority } from '../buttons/RelationshipButton'


// TODO: Inject the action from the creator component?
class CommunityPicker extends Picker {
  // followAll() {
  //   const { inactive } = this.props.relationshipMap
  //   const personRefs = this.refs.streamComponent.refs.wrappedInstance.refs
  //   const relationship = inactive.length === 0 ? RelationshipPriority.INACTIVE : RelationshipPriority.FRIEND
  //   for (const propName in personRefs) {
  //     if (personRefs.hasOwnProperty(propName)) {
  //       const personContainer = personRefs[propName].refs.wrappedInstance
  //       const relationshipButton = personContainer.refs.relationshipButton
  //       relationshipButton.updatePriority(relationship.priority)
  //     }
  //   }
  // }


  render() {
    return (
      <div className={classNames('CommunityPicker', 'Panel', {isFollowingAll: this.isFollowingAll()})}>
        <Button ref="followAllButton" onClick={() => this.followAll()}>
          <span>{this.renderBigButtonText()}</span>
        </Button>
        <StreamComponent ref="streamComponent" action={loadCommunities} />
      </div>
    )
  }
}

export default CommunityPicker

CommunityPicker.propTypes = {
  relationshipMap: React.PropTypes.any.isRequired,
}


// import React from 'react'
// import { loadCommunities } from '../../actions/onboarding'
// import StreamComponent from '../streams/StreamComponent'

// // TODO: Inject the action from the creator component?
// class CommunityPicker extends React.Component {
//   render() {
//     return (
//       <StreamComponent ref="streamComponent" action={loadCommunities} />
//     )
//   }
// }

// export default CommunityPicker

