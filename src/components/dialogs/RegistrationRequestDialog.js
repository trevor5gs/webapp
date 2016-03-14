import React from 'react'
import Emoji from '../../components/assets/Emoji'
import RegistrationRequestForm from '../../components/forms/RegistrationRequestForm'
import AppleStoreLink from '../../components/support/AppleStoreLink'

const RegistrationRequestDialog = () =>
  <div className="FormDialog">
    <h1>
      <Emoji name="muscle" title="Nice!" size={ 32 } style={{ marginRight: `${10 / 16}rem` }} />
      Be inspired.
    </h1>
    <RegistrationRequestForm />
    <AppleStoreLink />
  </div>

export default RegistrationRequestDialog

