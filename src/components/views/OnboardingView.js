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

  getRelationshipMap() {
    const { json } = this.props
    const { result } = json
    const relationshipMap = { following: [], inactive: [] }
    if (!result || !result.type || !result.ids) {
      return relationshipMap
    }
    for (const id of result.ids) {
      const model = json[result.type][id]
      switch (model.relationshipPriority) {
      case 'friend':
      case 'noise':
        relationshipMap.following.push(model)
        break
      default:
        relationshipMap.inactive.push(model)
        break
      }
    }
    return relationshipMap
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
            relationshipMap={this.getRelationshipMap()}
            nextPath="/onboarding/awesome-people"
            batchSave={ bindActionCreators(relationshipBatchSave, dispatch) }
            lockNext
            title="What are you interested in?"
            message="Follow the Ello Communities that you find most inspiring." />
          <CommunityPicker />
        </div>
      )

    case 'PeoplePicker':
      const rm = this.getRelationshipMap()
      return (
        <div className="PeoplePicker Panel">
          <OnboardingHeader
            relationshipMap={rm}
            nextPath="/onboarding/profile-header"
            batchSave={ bindActionCreators(relationshipBatchSave, dispatch) }
            title="Follow some awesome people."
            message="Ello is full of interesting and creative people committed to building a positive community." />
          <PeoplePicker
            shouldAutoFollow={ stream.type && stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS ? true : false }
            relationshipMap={rm}
            tracking={ tracking } />
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
              nextPath="/friends"
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
    json: state.json,
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
  json: React.PropTypes.shape,
}

export default connect(mapStateToProps)(OnboardingView)

