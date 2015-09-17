import React from 'react'
import { loadAwesomePeople } from '../../actions/onboarding'
import StreamComponent from '../streams/StreamComponent'
import RelationshipBatchPicker from './RelationshipBatchPicker'
import { RelationshipPriority } from '../buttons/RelationshipButton'
import Button from '../buttons/Button'

class PeoplePicker extends RelationshipBatchPicker {
  componentDidMount() {
    super.componentDidMount()
    this.props.tracking.trackPageView()
  }

  trackEvent(event, options) {
    return this.props.tracking.trackEvent(event, options)
  }

  followAll() {
    const personRefs = this.refs.streamComponent.refs.wrappedInstance.refs
    for (const ref in personRefs) {
      if (personRefs.hasOwnProperty(ref)) {
        personRefs[ref].setRelationshipPriority(RelationshipPriority.FRIEND)
      }
    }
    this.trackEvent('follow-all-20-button-clicked')
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
  tracking: React.PropTypes.shape({
    trackEvent: React.PropTypes.func.isRequired,
    trackPageView: React.PropTypes.func.isRequired,
  }),
}

export default PeoplePicker

