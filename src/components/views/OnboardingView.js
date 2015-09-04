import React from 'react'
import * as OnboardingActions from '../../actions/onboarding'
import OnboardingHeader from '../navigation/OnboardingHeader'
import StreamComponent from '../streams/StreamComponent'
import AvatarUploader from '../uploaders/AvatarUploader'
import CoverUploader from '../uploaders/CoverUploader'
import Button from '../buttons/Button'
import BioForm from '../forms/BioForm'
import { RelationshipPriority } from '../buttons/RelationshipButton'

export class RelationshipBatchPicker extends React.Component {
  componentDidMount() {
    this.leaveMethod = this.routerWillLeave.bind(this)
    this.context.router.addTransitionHook(this.leaveMethod)
  }

  routerWillLeave() {
    const friends = React.findDOMNode(this).querySelectorAll('[data-priority="friend"]')
    const postPayload = { user_ids: [], priority: 'friend'}
    for (const value of friends) {
      postPayload.user_ids.push(value.dataset.userId)
    }
  }

  componentWillUnmount() {
    this.context.router.removeTransitionHook(this.leaveMethod)
  }
}

RelationshipBatchPicker.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export class ChannelPicker extends RelationshipBatchPicker {
  render() {
    return (
      <div className="ChannelPicker Panel">
        <OnboardingHeader
            nextPath="/onboarding/awesome-people"
            title="What are you interested in?"
            message="Follow the Ello Communities that you find most inspiring." />
        <StreamComponent action={OnboardingActions.loadChannels} />
      </div>
    )
  }
}

export class PeoplePicker extends RelationshipBatchPicker {
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
        <OnboardingHeader
            nextPath="/onboarding/profile-header"
            title="Follow some awesome people."
            message="Ello is full of interesting and creative people committed to building a positive community." />
          <Button ref="followAllButton" onClick={() => this.followAll()}>Follow All (20)</Button>
        <StreamComponent ref="streamComponent" action={OnboardingActions.loadAwesomePeople} />
      </div>
    )
  }
}

export class CoverPicker extends React.Component {
  render() {
    return (
      <div className="CoverPicker Panel">
        <OnboardingHeader
            nextPath="/onboarding/profile-avatar"
            title="Customize your profile."
            message="Choose a header image." />
        <CoverUploader />
      </div>
    )
  }
}

export class AvatarPicker extends React.Component {
  render() {
    return (
      <div className="AvatarPicker Panel">
        <OnboardingHeader
            nextPath="/onboarding/profile-bio"
            title="Customize your profile."
            message="Choose an avatar." />
        <AvatarUploader />
      </div>
    )
  }
}

export class BioCreator extends React.Component {
  render() {
    return (
      <div className="BioCreator Panel">
        <OnboardingHeader
            nextPath="/discover"
            title="Customize your profile."
            message="Fill out your bio." />
        <BioForm />
      </div>
    )
  }
}

