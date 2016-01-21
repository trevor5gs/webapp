import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { requestInvite } from '../../actions/profile'
import FormButton from '../forms/FormButton'
import EmailControl from '../forms/EmailControl'
import { isFormValid, getEmailStateFromClient } from '../forms/Validators'

class RegistrationRequestForm extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      formStatus: STATUS.INDETERMINATE,
      emailState: { status: STATUS.INDETERMINATE, message: '' },
    }
    this.handleSubmit = ::this.handleSubmit
    this.emailControlWasChanged = ::this.emailControlWasChanged
  }

  componentWillReceiveProps(nextProps) {
    this.emailValue = ''
    const { availability } = nextProps
    if (availability && availability.hasOwnProperty('email')) {
      this.onValidateEmailResponse(availability)
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(requestInvite(this.emailValue))
    this.setState({ formStatus: STATUS.SUBMITTED })
  }

  emailControlWasChanged({ email }) {
    this.emailValue = email
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: email, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  renderSubmitted() {
    return (
      <div>Please check your email to join Ello</div>
    )
  }

  renderForm() {
    const { emailState } = this.state
    const isValid = isFormValid([emailState])
    return (
      <form
        className="AuthenticationForm"
        id="RegistrationRequestForm"
        noValidate="novalidate"
        onSubmit={ this.handleSubmit }
        role="form"
      >
        <EmailControl
          classList="asBoxControl"
          label={ `Email ${emailState.message}` }
          onChange={ this.emailControlWasChanged }
          tabIndex="1"
        />
        <FormButton disabled={ !isValid } tabIndex="2">Sign up</FormButton>
      </form>
    )
  }

  render() {
    const { formStatus } = this.state
    return formStatus === STATUS.SUBMITTED ? this.renderSubmitted() : this.renderForm()
  }
}

RegistrationRequestForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(RegistrationRequestForm)

