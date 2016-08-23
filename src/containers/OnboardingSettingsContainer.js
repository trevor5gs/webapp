import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { openAlert, closeAlert } from '../actions/modals'
import { saveAvatar, saveCover } from '../actions/profile'
import {
  selectAvatar,
  selectCoverImage,
  selectIsAvatarBlank,
  selectIsCoverImageBlank,
  selectIsInfoFormBlank,
} from '../selectors/profile'
import OnboardingSettings from '../components/onboarding/OnboardingSettings'

function mapStateToProps(state) {
  const avatar = selectAvatar(state)
  const coverImage = selectCoverImage(state)
  const isAvatarBlank = selectIsAvatarBlank(state)
  const isCoverBlank = selectIsCoverImageBlank(state)
  const isInfoFormBlank = selectIsInfoFormBlank(state)
  const isNextDisabled = isAvatarBlank && isCoverBlank && isInfoFormBlank
  return {
    avatar,
    coverImage,
    isAvatarBlank,
    isCoverBlank,
    isNextDisabled,
  }
}

class OnboardingSettingsContainer extends Component {

  static propTypes = {
    avatar: PropTypes.object,
    coverImage: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isAvatarBlank: PropTypes.bool.isRequired,
    isCoverBlank: PropTypes.bool.isRequired,
    isNextDisabled: PropTypes.bool.isRequired,
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
    const { avatar, dispatch, coverImage, isAvatarBlank, isCoverBlank, isNextDisabled } = this.props
    return {
      avatar,
      closeAlert: bindActionCreators(closeAlert, dispatch),
      coverImage,
      isAvatarBlank,
      isCoverBlank,
      nextLabel: 'Invite Cool People',
      onDoneClick: isNextDisabled ? null : this.onDoneClick,
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
    return <OnboardingSettings isNextDisabled={this.props.isNextDisabled} />
  }
}

export default connect(mapStateToProps)(OnboardingSettingsContainer)

