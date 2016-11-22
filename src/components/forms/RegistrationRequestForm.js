import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import debounce from 'lodash/debounce'
import { isAndroid } from '../../lib/jello'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { trackEvent } from '../../actions/analytics'
import { requestInvite } from '../../actions/profile'
import FormButton from '../forms/FormButton'
import EmailControl from '../forms/EmailControl'
import { isFormValid, getEmailStateFromClient } from '../forms/Validators'
import { invite } from '../../networking/api'
import {
  addPageVisibilityObserver,
  removePageVisibilityObserver,
} from '../viewport/PageVisibilityComponent'

function renderSubmitted() {
  return (
    <div className="RegistrationSuccess">
      Rad.<br />
      Check your email to complete sign-up.
    </div>
  )
}

class RegistrationRequestForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    inModal: PropTypes.bool,
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

  componentDidMount() {
    addPageVisibilityObserver(this)
  }

  componentWillReceiveProps(nextProps) {
    const { availability } = nextProps
    if (availability && {}.hasOwnProperty.call(availability, 'email')) {
      this.onValidateEmailResponse(availability)
    }
  }

  componentWillUnmount() {
    removePageVisibilityObserver(this)
  }

  onBeforeUnload() {
    const { dispatch } = this.props
    const { formStatus } = this.state
    if (formStatus !== STATUS.SUBMITTED) {
      dispatch(trackEvent('modal-registration-request-abandonment'))
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

  onSubmit = (e) => {
    e.preventDefault()
    const { dispatch, inModal } = this.props
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: this.emailValue, currentStatus })
    if (newState.status === STATUS.SUCCESS) {
      dispatch(requestInvite(this.emailValue))
      if (inModal) {
        dispatch(trackEvent('modal-registration-request-form-completion'))
      }
      this.setState({ formStatus: STATUS.SUBMITTED })
    } else if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  delayedShowEmailError = () => {
    this.setState({ showEmailError: true })
  }

  renderForm() {
    const { emailState, showEmailError } = this.state
    const isValid = isFormValid([emailState])
    return (
      <div className="RegistrationRequestForm">
        <h1>
          Create an account today.
        </h1>
        <h2>
          Receive the best in art, design, fashion, and more - straight in your inbox.
        </h2>
        <form
          action={invite().path}
          className="AuthenticationForm"
          id="RegistrationRequestForm"
          method="POST"
          noValidate="novalidate"
          onSubmit={this.onSubmit}
          role="form"
        >
          <EmailControl
            classList="isBoxControl"
            label="Email"
            onChange={this.onChangeEmailControl}
            onBlur={isAndroid() ? () => document.body.classList.remove('isCreditsHidden') : null}
            onFocus={isAndroid() ? () => document.body.classList.add('isCreditsHidden') : null}
            tabIndex="1"
          />
          {(showEmailError && emailState.status !== STATUS.INDETERMINATE) ?
            <p className="HoppyStatusMessage hasContent">{emailState.message}</p> :
            <p className="HoppyStatusMessage"><span /></p>
          }
          <FormButton className="FormButton isRounded isGreen" disabled={!isValid} tabIndex="2">
            Sign up
          </FormButton>
        </form>
        <Link className="HaveAccountLink" to="/enter">Already have an account?</Link>
      </div>
    )
  }

  render() {
    const { formStatus } = this.state
    return formStatus === STATUS.SUBMITTED ? renderSubmitted() : this.renderForm()
  }
}

export default connect()(RegistrationRequestForm)

