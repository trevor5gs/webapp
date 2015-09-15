import React from 'react'
import { loadChannels } from '../../actions/onboarding'
import StreamComponent from '../streams/StreamComponent'
import RelationshipBatchPicker from './RelationshipBatchPicker'

// TODO: Inject the action from the creator component?
class ChannelPicker extends RelationshipBatchPicker {
  render() {
    return (
      <StreamComponent action={loadChannels} />
    )
  }
}

ChannelPicker.propTypes = {
  saveAction: React.PropTypes.func.isRequired,
}

export default ChannelPicker

