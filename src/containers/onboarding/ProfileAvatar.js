/* eslint-disable react/prefer-stateless-function */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { trackEvent } from '../../actions/tracking'
import { closeAlert, openAlert } from '../../actions/modals'
import { saveAvatar } from '../../actions/profile'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import Avatar from '../../components/assets/Avatar'
import Uploader from '../../components/uploaders/Uploader'
import Cover from '../../components/assets/Cover'
import { MainView } from '../../components/views/MainView'

class ProfileAvatar extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
  }

  onClickNext = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('next-avatar-picker'))
    dispatch(push('/onboarding/profile-bio'))
  }

  onClickSkip = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('skipped-avatar-picker'))
    dispatch(push('/onboarding/profile-bio'))
  }

  render() {
    const { coverDPI, coverOffset, dispatch, profile } = this.props
    return (
      <MainView className="AvatarPicker">
        <OnboardingHeader
          message="Choose an avatar."
          title="Customize your profile."
          nextAction={this.onClickNext}
          skipAction={this.onClickSkip}
        />

        <div className="AvatarPickerBody" >
          <Uploader
            closeAlert={bindActionCreators(closeAlert, dispatch)}
            message="Or drag & drop it"
            openAlert={bindActionCreators(openAlert, dispatch)}
            recommend="Recommended image size: 360 x 360"
            saveAction={bindActionCreators(saveAvatar, dispatch)}
            title="Pick an Avatar"
          />
          <Avatar
            isModifiable
            size="large"
            sources={profile.avatar}
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

export default connect(mapStateToProps)(ProfileAvatar)

