/* eslint-disable react/prefer-stateless-function */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { ONBOARDING_VERSION } from '../../constants/application_types'
import { saveProfile } from '../../actions/profile'
import { trackEvent } from '../../actions/tracking'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import Avatar from '../../components/assets/Avatar'
import InfoForm from '../../components/forms/InfoForm'
import Cover from '../../components/assets/Cover'
import { MainView } from '../../components/views/MainView'

class ProfileBio extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(saveProfile({ web_onboarding_version: ONBOARDING_VERSION }))
  }

  onClickNext = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('next-info-picker'))
    dispatch(push('/'))
  }

  onClickSkip = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('skipped-info-picker'))
    dispatch(push('/'))
  }

  render() {
    const { coverDPI, coverOffset, profile } = this.props
    return (
      <MainView className="InfoPicker">
        <OnboardingHeader
          title="Customize your profile."
          message="Fill out your bio."
          nextAction={this.onClickNext}
          skipAction={this.onClickSkip}
        />

        <div className="InfoPickerBody" >
          <Avatar
            className="isLarge"
            size="large"
            sources={profile.avatar}
          />
          <InfoForm
            tabIndexStart={1}
          />

        </div>
        <Cover
          coverDPI={coverDPI}
          coverImage={profile.coverImage}
          coverOffset={coverOffset}
        />
      </MainView>
    )
  }
}

const mapStateToProps = (state) => {
  const { gui, profile } = state
  return {
    coverDPI: gui.coverDPI,
    coverOffset: gui.coverOffset,
    profile,
  }
}

export default connect(mapStateToProps)(ProfileBio)

