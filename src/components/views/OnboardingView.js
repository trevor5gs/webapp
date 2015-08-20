import React from 'react'
import * as OnboardingActions from '../../actions/onboarding'
import OnboardingHeader from '../navigation/OnboardingHeader'
import StreamComponent from '../streams/StreamComponent'

export class ChannelPicker extends React.Component {
  render() {
    return (
      <div className="Panel">
        <OnboardingHeader
          nextPath="/onboarding/awesome-people"
          title="What are you interested in?"
          message="Follow ello communities" />
        <StreamComponent action={OnboardingActions.loadChannels} />
      </div>
    )
  }
}

export class PeoplePicker extends React.Component {
  render() {
    return (
      <div className="Panel">
        <OnboardingHeader
          nextPath="/onboarding/profile-header"
          title="Awesome Peeps"
          message="Follow awesome peeps" />
        <StreamComponent action={OnboardingActions.loadAwesomePeople} />
      </div>
    )
  }
}

export class HeaderPicker extends React.Component {
  render() {
    return (
      <div className="Panel">
        <OnboardingHeader
          nextPath="/onboarding/profile-avatar"
          title="Profile Header view"
          message="Add a header" />
        <div>PROFILE HEADER VIEW</div>
      </div>
    )
  }
}

export class AvatarPicker extends React.Component {
  render() {
    return (
      <div className="Panel">
        <OnboardingHeader
        nextPath="/discover"
        title="Add an avatar"
        message="Add an avatar" />
        <div>Stuff goes here</div>
      </div>
    )
  }
}

