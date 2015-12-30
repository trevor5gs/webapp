import React from 'react'
import AppleStoreLink from '../../components/support/AppleStoreLink'
import RegistrationRequestForm from '../../components/forms/RegistrationRequestForm'

const RegistrationRequestDialog = () =>
  <div className="FormDialog">
    <h1><img src="/static/images/support/muscle.png" width="32" height="32" alt="muscle" /> Be inspired.</h1>
    <RegistrationRequestForm/>
    <AppleStoreLink/>
  </div>

export default RegistrationRequestDialog

