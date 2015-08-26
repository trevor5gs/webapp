import React from 'react'
import * as OnboardingActions from '../../actions/onboarding'
import OnboardingHeader from '../navigation/OnboardingHeader'
import StreamComponent from '../streams/StreamComponent'
import AvatarUploader from '../uploaders/AvatarUploader'
import HeaderUploader from '../uploaders/HeaderUploader'
import HeaderCarousel from '../carousels/HeaderCarousel'
import { Button } from '../buttons/Button'
import BioForm from '../forms/BioForm'

export class ChannelPicker extends React.Component {
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

export class PeoplePicker extends React.Component {
  render() {
    return (
      <div className="PeoplePicker Panel">
        <OnboardingHeader
            nextPath="/onboarding/profile-header"
            title="Follow some awesome people."
            message="Ello is full of interesting and creative people committed to building a positive community." />
        <Button>Follow All (20)</Button>
        <StreamComponent action={OnboardingActions.loadAwesomePeople} />
      </div>
    )
  }
}

export class HeaderPicker extends React.Component {
  render() {
    return (
      <div className="HeaderPicker Panel">
        <OnboardingHeader
            nextPath="/onboarding/profile-avatar"
            title="Customize your profile."
            message="Choose a header image by @username or upload your own." />
        <HeaderUploader />
        <HeaderCarousel />
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

