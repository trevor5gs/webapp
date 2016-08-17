import React, { PropTypes } from 'react'
import OnboardingNavbar from './OnboardingNavbar'
import { MainView } from '../views/MainView'
import InfoForm from '../../components/forms/InfoForm'
import Uploader from '../../components/uploaders/Uploader'
import Avatar from '../../components/assets/Avatar'
import CoverMini from '../../components/assets/CoverMini'

const OnboardingSettings = (props, context) => {
  const { avatar, closeAlert, coverImage, openAlert, saveAvatar, saveCover } = context
  return (
    <MainView className="Onboarding OnboardingSettings">
      <h1 className="OnboardingHeading">
        <span>Grow your creative influence. </span>
        <span>Completed profiles get way more views.</span>
      </h1>

      <div className="OnboardingCoverPicker">
        <CoverMini
          coverImage={coverImage}
          isModifiable
        />
        <Uploader
          title="Upload Header"
          line1="2560 x 1440"
          line2="Animated Gifs work too"
          openAlert={openAlert}
          closeAlert={closeAlert}
          saveAction={saveCover}
        />
      </div>

      <div className="OnboardingAvatarPicker" >
        <Avatar
          className="isXLarge"
          isModifiable
          size="large"
          sources={avatar}
        />
        <Uploader
          title="Upload Avatar"
          line1="360 x 360"
          line2="Animated Gifs work too"
          openAlert={openAlert}
          closeAlert={closeAlert}
          saveAction={saveAvatar}
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
  openAlert: PropTypes.func.isRequired,
  saveAvatar: PropTypes.func.isRequired,
  saveCover: PropTypes.func.isRequired,
}

export default OnboardingSettings

