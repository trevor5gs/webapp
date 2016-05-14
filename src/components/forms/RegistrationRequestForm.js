import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { debounce } from 'lodash'
import { isAndroid } from '../../vendor/jello'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { requestInvite } from '../../actions/profile'
import FormButton from '../forms/FormButton'
import EmailControl from '../forms/EmailControl'
import { isFormValid, getEmailStateFromClient } from '../forms/Validators'

class RegistrationRequestForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = {
      showEmailError: false,
      formStatus: STATUS.INDETERMINATE,
      emailState: { status: STATUS.INDETERMINATE, message: '' },
    }
    this.emailValue = ''

    this.delayedShowEmailError = debounce(this.delayedShowEmailError, 1000)
  }

  componentWillReceiveProps(nextProps) {
    const { availability } = nextProps
    if (availability && availability.hasOwnProperty('email')) {
      this.onValidateEmailResponse(availability)
    }
  }

  onBlurControl = () => {
    if (isAndroid()) {
      document.body.classList.remove('hideCredits')
    }
  }

  onChangeEmailControl = ({ email }) => {
    this.setState({ showEmailError: false })
    this.delayedShowEmailError()
    this.emailValue = email
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: email, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  onFocusControl = () => {
    if (isAndroid()) {
      document.body.classList.add('hideCredits')
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: this.emailValue, currentStatus })
    if (newState.status === STATUS.SUCCESS) {
      dispatch(requestInvite(this.emailValue))
      this.setState({ formStatus: STATUS.SUBMITTED })
    } else if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  delayedShowEmailError = () => {
    this.setState({ showEmailError: true })
  }

  renderSubmitted() {
    return (
      <div className="RegistrationSuccess">
        Rad.<br />
        Check your email to complete sign-up.
      </div>
    )
  }

  renderForm() {
    const { emailState, showEmailError } = this.state
    const isValid = isFormValid([emailState])
    return (
      <div>
        <h1>
          Join The Creators Network.
        </h1>
        <form
          className="AuthenticationForm"
          id="RegistrationRequestForm"
          noValidate="novalidate"
          onSubmit={this.onSubmit}
          role="form"
        >
          <EmailControl
            classList="asBoxControl"
            label="Email"
            onBlur={this.onBlurControl}
            onChange={this.onChangeEmailControl}
            onFocus={this.onFocusControl}
            tabIndex="1"
          />
          {(showEmailError && emailState.status !== STATUS.INDETERMINATE) ?
            <p className="HoppyStatusMessage hasContent">{emailState.message}</p> :
            <p className="HoppyStatusMessage"><span /></p>
          }
          <FormButton disabled={!isValid} tabIndex="2">Sign up</FormButton>
        </form>
        <Link className="HaveAccountLink" to="/enter">Have an account?</Link>
      </div>
    )
  }

  render() {
    const { formStatus } = this.state
    return formStatus === STATUS.SUBMITTED ? this.renderSubmitted() : this.renderForm()
  }
}

export default connect()(RegistrationRequestForm)

