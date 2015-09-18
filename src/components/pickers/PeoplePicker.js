import React from 'react'
import { loadAwesomePeople } from '../../actions/onboarding'
import StreamComponent from '../streams/StreamComponent'
import RelationshipBatchPicker from './RelationshipBatchPicker'
import { RelationshipPriority } from '../buttons/RelationshipButton'
import Button from '../buttons/Button'

class PeoplePicker extends RelationshipBatchPicker {
  constructor(props, context) {
    super(props, context)
  }

  componentDidUpdate() {
    if (this.props.shouldAutoFollow) {
      requestAnimationFrame(() => {
        this.followAll()
      })
    }
  }

  trackEvent(event, options) {
    return this.props.tracking.trackEvent(event, options)
  }

  isFollowingAll() {
    const personRefs = this.refs.streamComponent.refs.wrappedInstance.refs
    const friendEls = React.findDOMNode(this).querySelectorAll('[data-priority="friend"]')
    return Object.keys(personRefs).length === friendEls.length && friendEls > 0
  }

  followAll() {
    const isFollowingAll = this.isFollowingAll()
    const priority = isFollowingAll ? RelationshipPriority.INACTIVE : RelationshipPriority.FRIEND
    const personRefs = this.refs.streamComponent.refs.wrappedInstance.refs
    for (const ref in personRefs) {
      if (personRefs.hasOwnProperty(ref)) {
        personRefs[ref].setRelationshipPriority(priority)
      }
    }
    React.findDOMNode(this).classList[isFollowingAll ? 'remove' : 'add']('isFollowingAll')
    this.trackEvent(isFollowingAll ? 'unfollow-all-20-button-clicked' : 'follow-all-20-button-clicked')
  }

  render() {
    return (
      <div className="PeoplePicker Panel">
        <Button ref="followAllButton" onClick={() => this.followAll()}>
          <span>Follow All (20)</span>
          <span>Following All (20)</span>
        </Button>
        <StreamComponent ref="streamComponent" action={loadAwesomePeople} />
      </div>
    )
  }
}

PeoplePicker.propTypes = {
  shouldAutoFollow: React.PropTypes.any,
  saveAction: React.PropTypes.func.isRequired,
  tracking: React.PropTypes.shape({
    trackEvent: React.PropTypes.func.isRequired,
    trackPageView: React.PropTypes.func.isRequired,
  }),
}

export default PeoplePicker

