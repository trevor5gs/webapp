import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { random } from 'lodash'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { AUTHENTICATION_PROMOTIONS } from '../../constants/promotions/authentication'
import { getUserCredentials } from '../../actions/authentication'
import { trackEvent } from '../../actions/tracking'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import EmailControl from '../../components/forms/EmailControl'
import PasswordControl from '../../components/forms/PasswordControl'
import FormButton from '../../components/forms/FormButton'
import {
  isFormValid,
  getEmailStateFromClient,
  getPasswordState,
} from '../../components/forms/Validators'
import AppleStoreLink from '../../components/support/AppleStoreLink'

class SignIn extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const userlist = AUTHENTICATION_PROMOTIONS
    const index = random(0, userlist.length - 1)
    this.state = {
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      featuredUser: userlist[index],
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
    }
    this.emailValue = ''
    this.passwordValue = ''
  }

  creditsTrackingEvent = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  };

  // TODO: Need to handle the return error or success when this is submitted
  handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(getUserCredentials(this.emailValue, this.passwordValue))
  };

  emailControlWasChanged = ({ email }) => {
    this.emailValue = email
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: email, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  };

  passwordControlWasChanged = ({ password }) => {
    this.passwordValue = password
    const { passwordState } = this.state
    const currentStatus = passwordState.status
    const newState = getPasswordState({ value: password, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ passwordState: newState })
    }
  };

  render() {
    const { emailState, passwordState, featuredUser } = this.state
    const isValid = isFormValid([emailState, passwordState])
    return (
      <section className="Authentication Panel">
        <div className="FormDialog">
          <h1>
            <img src="/static/images/support/v.png" width="32" height="32" alt="Hi" />
            Welcome back.
          </h1>
          <form
            className="AuthenticationForm"
            id="NewSessionForm"
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
            <PasswordControl
              classList="asBoxControl"
              label={ `Password ${passwordState.message}` }
              onChange={ this.passwordControlWasChanged }
              tabIndex="2"
            />
            <FormButton disabled={ !isValid } tabIndex="3">Enter Ello</FormButton>
          </form>
          <Link className="ForgotPasswordLink" to="/forgot-password">Forgot password?</Link>
        </div>
        <AppleStoreLink/>
        <Credits clickAction={ this.creditsTrackingEvent } user={ featuredUser } />
        <Cover coverImage={ featuredUser.coverImage } modifiers="asFullScreen withOverlay" />
      </section>
    )
  }
}

export default connect()(SignIn)

