/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../constants/action_types'
import { openAlert, closeAlert } from '../../actions/modals'
import { relationshipBatchSave } from '../../actions/onboarding'
import { saveCover, saveAvatar } from '../../actions/profile'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import CommunityPicker from '../../components/pickers/CommunityPicker'
import PeoplePicker from '../../components/pickers/PeoplePicker'
import Uploader from '../../components/uploaders/Uploader'
import InfoForm from '../../components/forms/InfoForm'
import Avatar from '../../components/assets/Avatar'
import Cover from '../../components/assets/Cover'

const ProfileBio = ({ profile }) =>
  <section className="InfoPicker Panel">
    <OnboardingHeader
      redirection
      nextPath="/"
      trackingLabel="info-picker"
      title="Customize your profile."
      message="Fill out your bio."
    />

    <div className="InfoPickerBody" >
      <Avatar
        size="large"
        sources={ profile.avatar }
      />
      <InfoForm
        tabIndexStart={ 1 }
      />

    </div>
    <Cover coverImage={ profile.coverImage } />
  </section>

ProfileBio.propTypes = {
  profile: PropTypes.object.isRequired,
}

/* eslint-disable react/prefer-stateless-function */
class Onboarding extends Component {

  static propTypes = {
    accessToken: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    json: PropTypes.object,
    params: PropTypes.shape({
      type: PropTypes.string,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
    profile: PropTypes.object,
    stream: PropTypes.object,
  }

  getRelationshipMap() {
    const { json, pathname } = this.props
    const result = json.pages ? json.pages[pathname] : null
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

  renderCommunities() {
    const { dispatch, stream } = this.props
    const rm = this.getRelationshipMap()
    return (
      <section className="CommunityPicker Panel">
        <OnboardingHeader
          relationshipMap={ rm }
          nextPath="/onboarding/awesome-people"
          trackingLabel="community-picker"
          batchSave={ bindActionCreators(relationshipBatchSave, dispatch) }
          lockNext
          title="What are you interested in?"
          message="Follow the Ello Communities that you find most inspiring."
        />
        <CommunityPicker
          dispatch={ dispatch }
          shouldAutoFollow={
            stream.type && stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS
          }
          relationshipMap={ rm }
        />
      </section>
    )
  }

  renderAwesomePeople() {
    const { dispatch, stream } = this.props
    const rm = this.getRelationshipMap()
    return (
      <section className="PeoplePicker Panel">
        <OnboardingHeader
          relationshipMap={ rm }
          nextPath="/onboarding/profile-header"
          trackingLabel="people-picker"
          batchSave={ bindActionCreators(relationshipBatchSave, dispatch) }
          title="Follow some awesome people."
          message="Ello is full of interesting and creative people committed to building a positive community."
        />
        <PeoplePicker
          dispatch={ dispatch }
          shouldAutoFollow={
            stream.type && stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS
          }
          relationshipMap={rm}
        />
      </section>
    )
  }

  renderProfileAvatar() {
    const { dispatch, profile } = this.props
    return (
      <section className="AvatarPicker Panel">
        <OnboardingHeader
          nextPath="/onboarding/profile-bio"
          trackingLabel="avatar-picker"
          title="Customize your profile."
          message="Choose an avatar."
        />

        <div className="AvatarPickerBody" >
          <Uploader
            title="Pick an Avatar"
            message="Or drag & drop it"
            recommend="Recommended image size: 360 x 360"
            openAlert={ bindActionCreators(openAlert, dispatch) }
            saveAction={ bindActionCreators(saveAvatar, dispatch) }
          />
          <Avatar
            isModifiable
            size="large"
            sources={ profile.avatar }
          />
        </div>
        <Cover coverImage={ profile.coverImage } />
      </section>
    )
  }

  renderProfileHeader() {
    const { dispatch, profile } = this.props
    return (
      <section className="CoverPicker Panel">
        <OnboardingHeader
          nextPath="/onboarding/profile-avatar"
          trackingLabel="cover-picker"
          title="Customize your profile."
          message="Choose a header image."
        />

        <Uploader
          title="Upload a header image"
          message="Or drag & drop"
          recommend="Recommended image size: 2560 x 1440"
          openAlert={ bindActionCreators(openAlert, dispatch) }
          closeAlert={ bindActionCreators(closeAlert, dispatch) }
          saveAction={ bindActionCreators(saveCover, dispatch) }
        />
        <Cover
          isModifiable
          coverImage={ profile.coverImage }
        />
      </section>
    )
  }

  render() {
    const { params, profile } = this.props
    const { type } = params

    switch (type) {
      case 'communities':
        return this.renderCommunities()
      case 'awesome-people':
        return this.renderAwesomePeople()
      case 'profile-avatar':
        return this.renderProfileAvatar()
      case 'profile-header':
        return this.renderProfileHeader()
      case 'profile-bio':
        return <ProfileBio profile={ profile } />
      default:
        return null
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    accessToken: state.authentication.accessToken,
    json: state.json,
    pathname: ownProps.location.pathname,
    profile: state.profile,
    stream: state.stream,
  }
}

export default connect(mapStateToProps)(Onboarding)


