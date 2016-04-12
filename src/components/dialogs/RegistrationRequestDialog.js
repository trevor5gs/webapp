import React from 'react'
import RegistrationRequestForm from '../../components/forms/RegistrationRequestForm'
import AppleStoreLink from '../../components/support/AppleStoreLink'

const RegistrationRequestDialog = () =>
  <div className="AuthenticationFormDialog">
    <RegistrationRequestForm />
    <AppleStoreLink />
  </div>

export default RegistrationRequestDialog

