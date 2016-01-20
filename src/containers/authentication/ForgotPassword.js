import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import random from 'lodash.random'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { AUTHENTICATION_PROMOTIONS } from '../../constants/promotion_types'
import { sendForgotPasswordRequest } from '../../actions/authentication'
import { trackEvent } from '../../actions/tracking'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import EmailControl from '../../components/forms/EmailControl'
import FormButton from '../../components/forms/FormButton'
import { isFormValid, getEmailStateFromClient } from '../../components/forms/Validators'
import AppleStoreLink from '../../components/support/AppleStoreLink'

class ForgotPassword extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      formStatus: STATUS.INDETERMINATE,
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      featuredUser: null,
    }
    this.emailValue = ''
    this.handleSubmit = ::this.handleSubmit
    this.creditsTrackingEvent = ::this.creditsTrackingEvent
    this.emailControlWasChanged = ::this.emailControlWasChanged
  }

  componentWillMount() {
    const userlist = AUTHENTICATION_PROMOTIONS
    const index = random(0, userlist.length - 1)
    this.setState({ featuredUser: userlist[index] })
  }

  creditsTrackingEvent() {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  handleSubmit(e) {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(sendForgotPasswordRequest(this.emailValue))
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
      <div>
        If your email address exists in our database, you will receive a
        password recovery link at your email address in a few minutes.
      </div>
    )
  }

  renderForm() {
    const { emailState } = this.state
    const isValid = isFormValid([emailState])
    return (
      <form
        className="AuthenticationForm"
        id="ForgotPasswordForm"
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
        <FormButton disabled={ !isValid } tabIndex="2">Reset password</FormButton>
      </form>
    )
  }

  render() {
    const { featuredUser, formStatus } = this.state
    return (
      <section className="Authentication Panel">
        <div className="FormDialog">
          <h1>
            <img src="/static/images/support/hot_shit.png" width="32" height="32" alt="hot shit" />
            Shit happens.
          </h1>
          { formStatus === STATUS.SUBMITTED ? this.renderSubmitted() : this.renderForm() }
        </div>
        <AppleStoreLink/>
        <Credits clickAction={ this.creditsTrackingEvent } user={ featuredUser } />
        <Cover coverImage={ featuredUser.coverImage } modifiers="asFullScreen" />
      </section>
    )
  }
}

ForgotPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(ForgotPassword)

