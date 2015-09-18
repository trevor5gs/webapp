import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { relationshipBatchSave } from '../../actions/onboarding'
import { saveCover, saveAvatar, loadProfile } from '../../actions/profile'
import { trackEvent, trackPageView } from '../../actions/tracking'
import { openAlert } from '../../actions/modals'
import * as ACTION_TYPES from '../../constants/action_types'
import OnboardingHeader from '../navigation/OnboardingHeader'
import CommunityPicker from '../pickers/CommunityPicker'
import PeoplePicker from '../pickers/PeoplePicker'
import Uploader from '../uploaders/Uploader'
import InfoForm from '../forms/InfoForm'
import Avatar from '../people/Avatar'
import Cover from '../covers/Cover'

class OnboardingView extends React.Component {

  componentWillMount() {
    this.props.dispatch(loadProfile())
  }

  getAvatarSource(profile) {
    const { payload } = profile
    const { avatar, tmpAvatar } = payload
    if (tmpAvatar) {
      return tmpAvatar
    }
    return avatar ? avatar.regular.url : null
  }

  getCoverSource(profile) {
    const { payload } = profile
    const { coverImage, tmpCover } = payload
    if (tmpCover) {
      return tmpCover
    }
    return coverImage ? coverImage.optimized.url : null
  }

  render() {
    const { dispatch, route, profile, stream } = this.props
    const { subComponentName } = route

    if (!subComponentName) {
      return <span/>
    }

    const tracking = bindActionCreators({ trackEvent, trackPageView }, dispatch)

    switch (subComponentName) {

    case 'CommunityPicker':
      return (
        <div className="CommunityPicker Panel">
          <OnboardingHeader
              nextPath="/onboarding/awesome-people"
              title="What are you interested in?"
              message="Follow the Ello Communities that you find most inspiring." />
          <CommunityPicker saveAction={ bindActionCreators(relationshipBatchSave, dispatch) }/>
        </div>
      )

    case 'PeoplePicker':
      return (
        <div className="PeoplePicker Panel">
          <OnboardingHeader
              nextPath="/onboarding/profile-header"
              title="Follow some awesome people."
              message="Ello is full of interesting and creative people committed to building a positive community." />
          <PeoplePicker
            shouldAutoFollow={ stream.type && stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS ? true : false }
            tracking={ tracking }
            saveAction={ bindActionCreators(relationshipBatchSave, dispatch) }/>
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

    case 'InfoPicker':
      return (
        <div className="InfoPicker Panel">
          <OnboardingHeader
              nextPath="/onboarding/communities"
              title="Customize your profile."
              message="Fill out your bio." />

          <Avatar imgSrc={this.getAvatarSource(profile)} />
          <InfoForm />
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
    stream: state.stream,
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
  stream: React.PropTypes.shape,
}

export default connect(mapStateToProps)(OnboardingView)

