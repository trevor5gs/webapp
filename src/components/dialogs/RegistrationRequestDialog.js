import React, { PropTypes } from 'react'
import RegistrationRequestForm from '../../components/forms/RegistrationRequestForm'
import { HeroPromotionCredits } from '../../components/heros/HeroParts'
import BackgroundImage from '../../components/assets/BackgroundImage'
import { XIcon } from '../../components/assets/Icons'

const RegistrationRequestDialog = ({ promotional }) =>
  <div className="AuthenticationFormDialog inModal">
    <BackgroundImage className="RegistrationRequestBackground hasOverlay6" isBackground sources={promotional.coverImage} />
    <RegistrationRequestForm />
    <HeroPromotionCredits sources={promotional.avatar} label="Posted by" username={promotional.username} />
    <button className="CloseModal XClose"><XIcon /></button>
  </div>

RegistrationRequestDialog.propTypes = {
  promotional: PropTypes.object,
}

export default RegistrationRequestDialog

