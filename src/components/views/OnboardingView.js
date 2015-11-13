import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { relationshipBatchSave } from '../../actions/onboarding'
import { saveCover, saveAvatar } from '../../actions/profile'
import { openAlert } from '../../actions/modals'
import * as ACTION_TYPES from '../../constants/action_types'
import OnboardingHeader from '../navigation/OnboardingHeader'
import CommunityPicker from '../pickers/CommunityPicker'
import PeoplePicker from '../pickers/PeoplePicker'
import Uploader from '../uploaders/Uploader'
import InfoForm from '../forms/InfoForm'
import Avatar from '../users/Avatar'
import Cover from '../covers/Cover'
import { checkAuth } from '../../networking/auth'

class OnboardingView extends React.Component {
  constructor(props, context) {
    super(props, context)
    // check auth
    const { accessToken, dispatch, router } = props
    checkAuth(dispatch, accessToken, router.location)
  }

  getAvatarSource(profile) {
    const { payload } = profile
    const { avatar, tmpAvatar } = payload
    if (tmpAvatar) {
      return tmpAvatar
    }
    return avatar ? avatar.large.url : null
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
    const { json, router } = this.props
    const result = json.pages ? json.pages[router.location.pathname] : null
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
    let rm
    const { dispatch, route, profile, stream } = this.props
    const { subComponentName } = route

    if (!subComponentName) {
      return <span/>
    }


    switch (subComponentName) {
    case 'CommunityPicker':
      rm = this.getRelationshipMap()
      return (
        <div className="CommunityPicker Panel">
          <OnboardingHeader
            relationshipMap={this.getRelationshipMap()}
            nextPath="/onboarding/awesome-people"
            trackingLabel="community-picker"
            batchSave={ bindActionCreators(relationshipBatchSave, dispatch) }
            lockNext
            title="What are you interested in?"
            message="Follow the Ello Communities that you find most inspiring." />
          <CommunityPicker
            shouldAutoFollow={ stream.type && stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS ? true : false }
            relationshipMap={rm} />
        </div>
      )

    case 'PeoplePicker':
      rm = this.getRelationshipMap()
      return (
        <div className="PeoplePicker Panel">
          <OnboardingHeader
            relationshipMap={rm}
            nextPath="/onboarding/profile-header"
            trackingLabel="people-picker"
            batchSave={ bindActionCreators(relationshipBatchSave, dispatch) }
            title="Follow some awesome people."
            message="Ello is full of interesting and creative people committed to building a positive community." />
          <PeoplePicker
            shouldAutoFollow={ stream.type && stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS ? true : false }
            relationshipMap={rm} />
        </div>
      )

    case 'CoverPicker':
      return (
        <div className="CoverPicker Panel">
          <OnboardingHeader
              nextPath="/onboarding/profile-avatar"
              trackingLabel="cover-picker"
              title="Customize your profile."
              message="Choose a header image." />

          <Uploader
            title="Upload a header image"
            message="Or drag & drop"
            recommend="Recommended image size: 2560 x 1440"
            openAlert={ bindActionCreators(openAlert, dispatch) }
            saveAction={ bindActionCreators(saveCover, dispatch) }/>
          <Cover
            isModifiable
            imgSrc={this.getCoverSource(profile)} />
        </div>
      )

    case 'AvatarPicker':
      return (
        <div className="AvatarPicker Panel">
          <OnboardingHeader
              nextPath="/onboarding/profile-bio"
              trackingLabel="avatar-picker"
              title="Customize your profile."
              message="Choose an avatar." />

          <Uploader
            title="Pick an Avatar"
            message="Or drag & drop it"
            recommend="Recommended image size: 360 x 360"
            openAlert={ bindActionCreators(openAlert, dispatch) }
            saveAction={ bindActionCreators(saveAvatar, dispatch) }/>
          <Avatar imgSrc={this.getAvatarSource(profile)} />
          <Cover
            imgSrc={this.getCoverSource(profile)} />
        </div>
      )

    case 'InfoPicker':
      return (
        <div className="InfoPicker Panel">
          <OnboardingHeader
              redirection
              nextPath={ENV.REDIRECT_URI}
              trackingLabel="info-picker"
              title="Customize your profile."
              message="Fill out your bio." />

          <Avatar imgSrc={this.getAvatarSource(profile)} />
          <InfoForm />
          <Cover
            imgSrc={this.getCoverSource(profile)} />
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
    accessToken: state.accessToken.token,
    json: state.json,
    profile: state.profile,
    router: state.router,
    stream: state.stream,
  }
}

OnboardingView.propTypes = {
  accessToken: React.PropTypes.string,
  dispatch: React.PropTypes.func.isRequired,
  json: React.PropTypes.object,
  profile: React.PropTypes.object,
  route: React.PropTypes.object,
  router: React.PropTypes.object,
  stream: React.PropTypes.object,
}

export default connect(mapStateToProps)(OnboardingView)

