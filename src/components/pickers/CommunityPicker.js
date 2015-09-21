import React from 'react'
import { loadCommunities } from '../../actions/onboarding'
import StreamComponent from '../streams/StreamComponent'
import RelationshipBatchPicker from './RelationshipBatchPicker'

// TODO: Inject the action from the creator component?
class CommunityPicker extends RelationshipBatchPicker {

  render() {
    return (
      <StreamComponent ref="streamComponent" action={loadCommunities} />
    )
  }
}

CommunityPicker.propTypes = {
  saveAction: React.PropTypes.func.isRequired,
}

export default CommunityPicker

