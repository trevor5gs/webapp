import React, { Component } from 'react'
import AppleStoreLink from '../../components/support/AppleStoreLink'
import RegistrationRequestForm from '../../components/forms/RegistrationRequestForm'

class RegistrationRequestDialog extends Component {
  render() {
    return (
      <div className="FormDialog">
        <h1>:e: Be inspired.</h1>
        <RegistrationRequestForm/>
        <AppleStoreLink/>
      </div>
    )
  }
}

export default RegistrationRequestDialog

