import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
// import { requestInvite, validateEmail } from '../../actions/profile'
import FormButton from '../forms/FormButton'
import EmailControl from '../forms/EmailControl'

class ForgotPassword extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      emailStatus: STATUS.INDETERMINATE,
    }
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  handleControlChange(vo) {
    return vo
  }

  render() {
    const { emailStatus } = this.state
    return (
      <form id="ForgotPassword" className="AuthenticationForm" onSubmit={this.handleSubmit.bind(this)} role="form" noValidate="novalidate">
        <EmailControl tabIndex="1" text="" status={emailStatus} controlWasChanged={this.handleControlChange.bind(this)} />
        <FormButton tabIndex="2">Reset password</FormButton>
      </form>
    )
  }
}

export default connect()(ForgotPassword)

