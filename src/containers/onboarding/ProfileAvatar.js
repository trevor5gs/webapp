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

class ProfileAvatar extends Component {

  static propTypes = {
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
    const { dispatch, profile } = this.props
    return (
      <main className="AvatarPicker View" role="main">
        <OnboardingHeader
          message="Choose an avatar."
          title="Customize your profile."
          nextAction={ this.onClickNext }
          skipAction={ this.onClickSkip }
        />

        <div className="AvatarPickerBody" >
          <Uploader
            closeAlert={ bindActionCreators(closeAlert, dispatch) }
            message="Or drag & drop it"
            openAlert={ bindActionCreators(openAlert, dispatch) }
            recommend="Recommended image size: 360 x 360"
            saveAction={ bindActionCreators(saveAvatar, dispatch) }
            title="Pick an Avatar"
          />
          <Avatar
            isModifiable
            size="large"
            sources={ profile.avatar }
          />
        </div>
        <Cover coverImage={ profile.coverImage } />
      </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

export default connect(mapStateToProps)(ProfileAvatar)

