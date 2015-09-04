import React from 'react'
import OnboardingHeader from '../navigation/OnboardingHeader'
import ChannelPicker from '../pickers/ChannelPicker'
import PeoplePicker from '../pickers/PeoplePicker'
import CoverUploader from '../covers/CoverUploader'
import AvatarUploader from '../people/AvatarUploader'
import BioForm from '../forms/BioForm'

class OnboardingView extends React.Component {

  render() {
    const { subComponentName } = this.props.route
    if (!subComponentName) {
      return <span/>
    }
    switch (subComponentName) {
    case 'ChannelPicker':
      return (
        <div className="ChannelPicker Panel">
          <OnboardingHeader
              nextPath="/onboarding/awesome-people"
              title="What are you interested in?"
              message="Follow the Ello Communities that you find most inspiring." />
          <ChannelPicker />
        </div>
      )

    case 'PeoplePicker':
      return (
        <div className="PeoplePicker Panel">
          <OnboardingHeader
              nextPath="/onboarding/profile-header"
              title="Follow some awesome people."
              message="Ello is full of interesting and creative people committed to building a positive community." />
          <PeoplePicker />
        </div>
      )

    case 'CoverPicker':
      return (
        <div className="CoverPicker Panel">
          <OnboardingHeader
              nextPath="/onboarding/profile-avatar"
              title="Customize your profile."
              message="Choose a header image." />
          <CoverUploader />
        </div>
      )

    case 'AvatarPicker':
      return (
        <div className="AvatarPicker Panel">
          <OnboardingHeader
              nextPath="/onboarding/profile-bio"
              title="Customize your profile."
              message="Choose an avatar." />
          <AvatarUploader />
        </div>
      )

    case 'BioPicker':
      return (
        <div className="BioPicker Panel">
          <OnboardingHeader
              nextPath="/discover"
              title="Customize your profile."
              message="Fill out your bio." />
          <BioForm />
        </div>
      )

    default:
      return <span/>
    }
  }
}

OnboardingView.propTypes = {
  route: React.PropTypes.shape({
    subComponentName: React.PropTypes.string,
  }),
}

export default OnboardingView

