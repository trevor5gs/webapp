import React from 'react'
import RegistrationRequestForm from '../../components/forms/RegistrationRequestForm'
import { AppleStore, GooglePlayStore } from '../../components/assets/AppStores'

const RegistrationRequestDialog = () =>
  <div className="AuthenticationFormDialog">
    <RegistrationRequestForm />
    <AppleStore />
    <GooglePlayStore />
  </div>

export default RegistrationRequestDialog

