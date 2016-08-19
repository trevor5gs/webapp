import React, { PropTypes } from 'react'
import classNames from 'classnames'
import OnboardingNavbar from './OnboardingNavbar'
import { MainView } from '../views/MainView'
import { ElloOutlineMark } from '../svg/ElloIcons'
import InfoForm from '../forms/InfoForm'
import Uploader from '../uploaders/Uploader'
import Avatar from '../assets/Avatar'
import CoverMini from '../assets/CoverMini'

const OnboardingSettings = (props, context) => {
  const { avatar, isAvatarBlank, saveAvatar } = context
  const { coverImage, isCoverBlank, saveCover } = context
  const { closeAlert, openAlert } = context
  return (
    <MainView className="Onboarding OnboardingSettings">
      <h1 className="OnboardingHeading">
        <span>Grow your creative influence. </span>
        <span>Completed profiles get way more views.</span>
      </h1>
      <div className="OnboardingCoverPicker">
        <Uploader
          className={classNames('isCoverUploader', { isCoverBlank })}
          closeAlert={closeAlert}
          line1="2560 x 1440"
          line2="Animated Gifs work too"
          openAlert={openAlert}
          saveAction={saveCover}
          title="Upload Header"
        />
        <CoverMini
          coverImage={coverImage}
          useGif
        />
      </div>
      <div className="OnboardingAvatarPicker" >
        <Uploader
          className={classNames('isAvatarUploader isOnboardingUploader', { isAvatarBlank })}
          title="Upload Avatar"
          line1="360 x 360"
          line2="Animated Gifs work too"
          openAlert={openAlert}
          closeAlert={closeAlert}
          saveAction={saveAvatar}
        />
        {isAvatarBlank ? <ElloOutlineMark /> : null}
        <Avatar
          className="isXLarge"
          size="large"
          sources={avatar}
          useGif
        />
      </div>
      <InfoForm
        className="OnboardingInfoForm"
        controlClassModifiers="isOnboardingControl"
        showSaveMessage
        tabIndexStart={1}
      />
      <OnboardingNavbar />
    </MainView>
  )
}

OnboardingSettings.contextTypes = {
  avatar: PropTypes.object,
  closeAlert: PropTypes.func.isRequired,
  coverImage: PropTypes.object,
  isAvatarBlank: PropTypes.bool,
  isCoverBlank: PropTypes.bool,
  openAlert: PropTypes.func.isRequired,
  saveAvatar: PropTypes.func.isRequired,
  saveCover: PropTypes.func.isRequired,
}

export default OnboardingSettings

