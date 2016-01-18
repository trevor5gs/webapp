import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { sendForgotPasswordRequest } from '../../actions/authentication'
import FormButton from '../forms/FormButton'
import EmailControl from '../forms/EmailControl'

class ForgotPassword extends Component {

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
    this.setState({ emailStatus: STATUS.SUBMITTED })
  }

  render() {
    const { emailStatus } = this.state
    const wasSubmitted = emailStatus === STATUS.SUBMITTED
    return wasSubmitted ?
      <div>
        If your email address exists in our database, you will receive a
        password recovery link at your email address in a few minutes.
      </div> :
      <form
        id="ForgotPassword"
        className="AuthenticationForm"
        onSubmit={::this.handleSubmit}
        role="form"
        noValidate="novalidate"
      >
        <EmailControl
          ref="emailControl"
          tabIndex="1"
          text=""
          status={emailStatus}
          classModifiers="asBoxControl"
        />
        <FormButton tabIndex="2">Reset password</FormButton>
      </form>
  }
}

ForgotPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(ForgotPassword)

