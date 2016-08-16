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
  const { coverDPI, coverOffset, isCoverHidden } = state.gui
  return {
    avatar: get(state, 'profile.avatar'),
    coverDPI,
    coverImage: get(state, 'profile.coverImage'),
    coverOffset,
    isCoverHidden,
  }
}

class OnboardingSettingsContainer extends Component {

  static propTypes = {
    avatar: PropTypes.object,
    coverDPI: PropTypes.string,
    coverImage: PropTypes.object,
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    isCoverHidden: PropTypes.bool,
  }

  static childContextTypes = {
    avatar: PropTypes.object,
    closeAlert: PropTypes.func,
    coverDPI: PropTypes.string,
    coverImage: PropTypes.object,
    coverOffset: PropTypes.number,
    isCoverHidden: PropTypes.bool,
    nextLabel: PropTypes.string,
    onDoneClick: PropTypes.func,
    onNextClick: PropTypes.func,
    openAlert: PropTypes.func,
    saveAvatar: PropTypes.func,
    saveCover: PropTypes.func,
  }

  getChildContext() {
    const { avatar, dispatch, coverDPI, coverImage, coverOffset, isCoverHidden } = this.props
    return {
      avatar,
      closeAlert: bindActionCreators(closeAlert, dispatch),
      coverDPI,
      coverImage,
      coverOffset,
      isCoverHidden,
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

