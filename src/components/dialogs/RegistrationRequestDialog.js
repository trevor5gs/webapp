import React, { PropTypes } from 'react'
import RegistrationRequestForm from '../../components/forms/RegistrationRequestForm'
import { HeroPromotionCredits } from '../../components/heros/HeroParts'
import BackgroundImage from '../../components/assets/BackgroundImage'

const RegistrationRequestDialog = ({ promotional }) =>
  <div className="AuthenticationFormDialog isSignUp">
    <BackgroundImage className="RegistrationRequestBackground hasOverlay6" isBackground sources={promotional.coverImage} />
    <RegistrationRequestForm />
    <HeroPromotionCredits sources={promotional.avatar} username={promotional.username} />
  </div>

RegistrationRequestDialog.propTypes = {
  promotional: PropTypes.object,
}

export default RegistrationRequestDialog

