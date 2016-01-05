import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { sendForgotPasswordRequest } from '../../actions/authentication'
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
    const { dispatch } = this.props
    dispatch(sendForgotPasswordRequest(this.refs.emailControl.refs.input.value))
  }

  render() {
    const { emailStatus } = this.state
    return (
      <form id="ForgotPassword" className="AuthenticationForm" onSubmit={::this.handleSubmit} role="form" noValidate="novalidate">
        <EmailControl ref="emailControl" tabIndex="1" text="" status={emailStatus} classModifiers="asBoxControl" />
        <FormButton tabIndex="2">Reset password</FormButton>
      </form>
    )
  }
}

export default connect()(ForgotPassword)

