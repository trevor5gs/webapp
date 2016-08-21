import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { get } from 'lodash'
import { openAlert, closeAlert } from '../actions/modals'
import {
  saveAvatar,
  saveCover,
} from '../actions/profile'
import OnboardingSettings from '../components/onboarding/OnboardingSettings'

function mapStateToProps(state) {
  return {
    avatar: get(state, 'profile.avatar'),
    coverImage: get(state, 'profile.coverImage'),
  }
}

class OnboardingSettingsContainer extends Component {

  static propTypes = {
    avatar: PropTypes.object,
    coverImage: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    avatar: PropTypes.object,
    closeAlert: PropTypes.func,
    coverImage: PropTypes.object,
    isAvatarBlank: PropTypes.bool,
    isCoverBlank: PropTypes.bool,
    nextLabel: PropTypes.string,
    onDoneClick: PropTypes.func,
    onNextClick: PropTypes.func,
    openAlert: PropTypes.func,
    saveAvatar: PropTypes.func,
    saveCover: PropTypes.func,
  }

  getChildContext() {
    const { avatar, dispatch, coverImage } = this.props
    return {
      avatar,
      closeAlert: bindActionCreators(closeAlert, dispatch),
      coverImage,
      isAvatarBlank: !(avatar && (avatar.tmp || avatar.original)),
      isCoverBlank: !(coverImage && (coverImage.tmp || coverImage.original)),
      nextLabel: 'Invite Cool People',
      onDoneClick: this.onDoneClick,
      onNextClick: this.onNextClick,
      openAlert: bindActionCreators(openAlert, dispatch),
      saveAvatar: bindActionCreators(saveAvatar, dispatch),
      saveCover: bindActionCreators(saveCover, dispatch),
    }
  }

  onDoneClick = () => {
    const { dispatch } = this.props
    dispatch(push('/following'))
  }

  onNextClick = () => {
    const { dispatch } = this.props
    dispatch(push('/onboarding/invitations'))
  }

  render() {
    return <OnboardingSettings />
  }
}

export default connect(mapStateToProps)(OnboardingSettingsContainer)

