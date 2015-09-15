import React from 'react'
import { loadAwesomePeople } from '../../actions/onboarding'
import StreamComponent from '../streams/StreamComponent'
import RelationshipBatchPicker from './RelationshipBatchPicker'
import { RelationshipPriority } from '../buttons/RelationshipButton'
import Button from '../buttons/Button'

class PeoplePicker extends RelationshipBatchPicker {
  followAll() {
    const personRefs = this.refs.streamComponent.refs.wrappedInstance.refs
    for (const ref in personRefs) {
      if (personRefs.hasOwnProperty(ref)) {
        personRefs[ref].setRelationshipPriority(RelationshipPriority.FRIEND)
      }
    }
  }

  render() {
    return (
      <div className="PeoplePicker Panel">
        <Button ref="followAllButton" onClick={() => this.followAll()}>Follow All (20)</Button>
        <StreamComponent ref="streamComponent" action={loadAwesomePeople} />
      </div>
    )
  }
}

PeoplePicker.propTypes = {
  saveAction: React.PropTypes.func.isRequired,
}

export default PeoplePicker

