import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { saveCover, saveAvatar } from '../../actions/profile'
import OnboardingHeader from '../navigation/OnboardingHeader'
import ChannelPicker from '../pickers/ChannelPicker'
import PeoplePicker from '../pickers/PeoplePicker'
import Uploader from '../uploaders/Uploader'
import BioForm from '../forms/BioForm'
import Avatar from '../people/Avatar'
import Cover from '../covers/Cover'
import { openAlert } from '../../actions/modals'

class OnboardingView extends React.Component {

  getAvatarSource(profile) {
    const { payload } = profile
    const { avatar } = payload
    return avatar && avatar.tmp ? avatar.tmp : null
  }

  getCoverSource(profile) {
    const { payload } = profile
    const { coverImage } = payload
    return coverImage && coverImage.tmp ? coverImage.tmp : null
  }

  render() {
    const { dispatch, route, profile } = this.props
    const { subComponentName } = route

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

          <Uploader
            title="Upload a header image"
            message="Or drag & drop"
            recommend="Recommended image size: 2560 x 1440"
            openAlert={ bindActionCreators(openAlert, dispatch) }
            saveAction={ bindActionCreators(saveCover, dispatch) }/>
          <Cover imgSrc={this.getCoverSource(profile)} />
        </div>
      )

    case 'AvatarPicker':
      return (
        <div className="AvatarPicker Panel">
          <OnboardingHeader
              nextPath="/onboarding/profile-bio"
              title="Customize your profile."
              message="Choose an avatar." />

          <Avatar imgSrc={this.getAvatarSource(profile)} />
          <Uploader
            title="Pick an Avatar"
            message="Or drag & drop it"
            recommend="Recommended image size: 360 x 360"
            openAlert={ bindActionCreators(openAlert, dispatch) }
            saveAction={ bindActionCreators(saveAvatar, dispatch) }/>
          <Cover imgSrc={this.getCoverSource(profile)} />
        </div>
      )

    case 'BioPicker':
      return (
        <div className="BioPicker Panel">
          <OnboardingHeader
              nextPath="/discover"
              title="Customize your profile."
              message="Fill out your bio." />

          <Avatar imgSrc={this.getAvatarSource(profile)} />

          <BioForm />
          <Cover imgSrc={this.getCoverSource(profile)} />
        </div>
      )

    default:
      return <span/>
    }
  }
}

// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

OnboardingView.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  route: React.PropTypes.shape({
    subComponentName: React.PropTypes.string,
  }),
  profile: React.PropTypes.shape({
    payload: React.PropTypes.shape,
  }),
}

export default connect(mapStateToProps)(OnboardingView)

