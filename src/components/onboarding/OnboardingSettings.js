import React, { PropTypes } from 'react'
import OnboardingNavbar from './OnboardingNavbar'
import { MainView } from '../views/MainView'
import InfoForm from '../../components/forms/InfoForm'
import Uploader from '../../components/uploaders/Uploader'
import Avatar from '../../components/assets/Avatar'
import Cover from '../../components/assets/Cover'

const OnboardingSettings = (props, context) => {
  const { avatar, closeAlert, coverDPI, coverImage, coverOffset,
    isCoverHidden, openAlert, saveAvatar, saveCover } = context
  return (
    <MainView className="Onboarding OnboardingSettings">
      <h1 className="OnboardingHeading">
        <span>Grow your creative influence. </span>
        <span>Completed profiles get way more views.</span>
      </h1>

      <div className="SettingsCoverPicker">
        <Uploader
          title="Upload a header image"
          message="Or drag & drop"
          recommend="Recommended image size: 2560 x 1440"
          openAlert={openAlert}
          closeAlert={closeAlert}
          saveAction={saveCover}
        />
        <Cover
          coverDPI={coverDPI}
          coverImage={coverImage}
          coverOffset={coverOffset}
          isHidden={isCoverHidden}
          isModifiable
        />
      </div>

      <div className="SettingsAvatarPicker" >
        <Uploader
          title="Pick an Avatar"
          message="Or drag & drop it"
          recommend="Recommended image size: 360 x 360"
          openAlert={openAlert}
          closeAlert={closeAlert}
          saveAction={saveAvatar}
        />
        <Avatar
          className="isLarge"
          isModifiable
          size="large"
          sources={avatar}
        />
      </div>

      <InfoForm
        controlClassModifiers="isBoxControl onWhite"
        showSaveMessage
        tabIndexStart={4}
      />

      <OnboardingNavbar />
    </MainView>
  )
}

OnboardingSettings.contextTypes = {
  avatar: PropTypes.object,
  closeAlert: PropTypes.func.isRequired,
  coverDPI: PropTypes.string.isRequired,
  coverImage: PropTypes.object,
  coverOffset: PropTypes.number.isRequired,
  isCoverHidden: PropTypes.bool.isRequired,
  openAlert: PropTypes.func.isRequired,
  saveAvatar: PropTypes.func.isRequired,
  saveCover: PropTypes.func.isRequired,
}

export default OnboardingSettings

