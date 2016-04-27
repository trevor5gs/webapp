/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { random, debounce } from 'lodash'
import { replace } from 'react-router-redux'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { AUTHENTICATION_PROMOTIONS } from '../../constants/promotions/authentication'
import { getInviteEmail } from '../../actions/invitations'
import { checkAvailability, signUpUser } from '../../actions/profile'
import { trackEvent } from '../../actions/tracking'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import EmailControl from '../../components/forms/EmailControl'
import InvitationCodeControl from '../../components/forms/InvitationCodeControl'
import FormButton from '../../components/forms/FormButton'
import PasswordControl from '../../components/forms/PasswordControl'
import UsernameControl from '../../components/forms/UsernameControl'
import {
  isFormValid,
  getUsernameStateFromClient,
  getUsernameStateFromServer,
  getInvitationCodeStateFromClient,
  getInvitationCodeStateFromServer,
  getEmailStateFromClient,
  getEmailStateFromServer,
  getPasswordState,
} from '../../components/forms/Validators'
import AppleStoreLink from '../../components/support/AppleStoreLink'

class Join extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    email: PropTypes.string,
    invitationCode: PropTypes.string,
  }

  componentWillMount() {
    const { invitationCode } = this.props
    const userlist = AUTHENTICATION_PROMOTIONS
    const index = random(0, userlist.length - 1)
    this.state = {
      showInvitationError: false,
      showEmailError: false,
      showPasswordError: false,
      showUsernameError: false,
      featuredUser: userlist[index],
      invitationCodeState: { status: STATUS.INDETERMINATE, message: '' },
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
      usernameState: { status: STATUS.INDETERMINATE, suggestions: null, message: '' },
    }

    this.emailValue = ''
    this.usernameValue = ''
    this.passwordValue = ''

    this.delayedShowInvitationError = debounce(this.delayedShowInvitationError, 1000)
    this.delayedShowEmailError = debounce(this.delayedShowEmailError, 1000)
    this.delayedShowUsernameError = debounce(this.delayedShowUsernameError, 1000)
    this.delayedShowPasswordError = debounce(this.delayedShowPasswordError, 1000)

    this.checkServerForAvailability = debounce(this.checkServerForAvailability, 300)
    if (invitationCode) {
      this.onChangeInvitationCodeControl({ invitationCode })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { availability, dispatch, email, invitationCode } = nextProps
    if (invitationCode && !email) {
      this.invitationCodeValue = invitationCode
      dispatch(getInviteEmail(invitationCode))
    } else if (email) {
      this.emailValue = email
      this.setState({ emailState: { status: STATUS.SUCCESS } })
    }
    if (!availability) { return }
    if (availability.hasOwnProperty('username')) {
      this.validateUsernameResponse(availability)
    }
    if (availability.hasOwnProperty('email')) {
      this.validateEmailResponse(availability)
    }
    if (availability.hasOwnProperty('invitationCode')) {
      this.validateInvitationCodeResponse(availability)
    }
  }

  onChangeInvitationCodeControl = ({ invitationCode }) => {
    this.setState({ showInvitationError: false })
    this.delayedShowInvitationError()
    this.invitationCodeValue = invitationCode
    const { invitationCodeState } = this.state
    const currentStatus = invitationCodeState.status
    const clientState = getInvitationCodeStateFromClient({ value: invitationCode, currentStatus })
    if (clientState.status === STATUS.SUCCESS) {
      if (currentStatus !== STATUS.REQUEST) {
        this.setState({ invitationCodeState: { status: STATUS.REQUEST, message: 'checking...' } })
      }
      // This will end up landing on `validateEmailResponse` after fetching
      this.checkServerForAvailability({ invitation_code: invitationCode })
      return
    }
    if (clientState.status !== currentStatus) {
      this.setState({ invitationCodeState: clientState })
    }
  }

  onChangeEmailControl = ({ email }) => {
    this.setState({ showEmailError: false })
    this.delayedShowEmailError()
    this.emailValue = email
    const { emailState } = this.state
    const currentStatus = emailState.status
    const clientState = getEmailStateFromClient({ value: email, currentStatus })
    if (clientState.status === STATUS.SUCCESS) {
      if (currentStatus !== STATUS.REQUEST) {
        this.setState({ emailState: { status: STATUS.REQUEST, message: 'checking...' } })
      }
      // This will end up landing on `validateEmailResponse` after fetching
      this.checkServerForAvailability({ email })
      return
    }
    if (clientState.status !== currentStatus) {
      this.setState({ emailState: clientState })
    }
  }

  onChangeUsernameControl = ({ username }) => {
    this.setState({ showUsernameError: false })
    this.delayedShowUsernameError()
    this.usernameValue = username
    const { usernameState } = this.state
    const currentStatus = usernameState.status
    const currentMessage = usernameState.message
    const clientState = getUsernameStateFromClient({ value: username, currentStatus })

    if (clientState.status === STATUS.SUCCESS) {
      if (currentStatus !== STATUS.REQUEST) {
        this.setState({ usernameState: { status: STATUS.REQUEST, message: 'checking...' } })
      }
      // This will end up landing on `validateUsernameResponse` after fetching
      this.checkServerForAvailability({ username })
      return
    }
    if (clientState.status !== currentStatus && clientState.message !== currentMessage) {
      this.setState({ usernameState: clientState })
    }
  }

  onChangePasswordControl = ({ password }) => {
    this.setState({ showPasswordError: false })
    this.delayedShowPasswordError()
    this.passwordValue = password
    const { passwordState } = this.state
    const currentStatus = passwordState.status
    const newState = getPasswordState({ value: password, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ passwordState: newState })
    }
  }

  onSubmit = async (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    const success = await dispatch(signUpUser(this.emailValue, this.usernameValue, this.passwordValue, this.invitationCodeValue))
    if (success) {
      dispatch(replace({ pathname: '/onboarding' }))
    }
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  checkServerForAvailability(vo) {
    this.props.dispatch(checkAvailability(vo))
  }

  validateUsernameResponse(availability) {
    const { usernameState } = this.state
    const currentStatus = usernameState.status
    const newState = getUsernameStateFromServer({ availability, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ usernameState: newState })
    }
  }

  validateEmailResponse(availability) {
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromServer({ availability, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  validateInvitationCodeResponse(availability) {
    const { invitationCodeState } = this.state
    const currentStatus = invitationCodeState.status
    const newState = getInvitationCodeStateFromServer({ availability, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ invitationCodeState: newState })
    }
  }

  delayedShowInvitationError = () => {
    this.setState({ showInvitationError: true })
  }

  delayedShowEmailError = () => {
    this.setState({ showEmailError: true })
  }

  delayedShowPasswordError = () => {
    this.setState({ showPasswordError: true })
  }

  delayedShowUsernameError = () => {
    this.setState({ showUsernameError: true })
  }

  renderStatus(state) {
    return () => {
      if (state.status === STATUS.FAILURE) {
        return <p>{state.message}</p>
      }

      return ''
    }
  }

  render() {
    const {
      invitationCodeState, showPasswordError,
      emailState, showInvitationError,
      usernameState, showEmailError,
      passwordState, showUsernameError,
      featuredUser } = this.state
    const { email } = this.props
    const isValid = isFormValid([emailState, usernameState, passwordState])
    const boxControlClassNames = 'asBoxControl'
    return (
      <section className="Authentication Panel">
        <div className="AuthenticationFormDialog">
          <h1>
            Welcome to Ello.
          </h1>

          <form
            className="AuthenticationForm"
            id="RegistrationForm"
            noValidate="novalidate"
            onSubmit={ this.onSubmit }
            role="form"
          >
            <InvitationCodeControl
              classList={ boxControlClassNames }
              label="Invitation Code"
              onChange={ this.onChangeInvitationCodeControl }
              status={ invitationCodeState.status }
              renderStatus={ showInvitationError ? this.renderStatus(invitationCodeState) : null }
              tabIndex="5"
              text={ this.invitationCodeValue }
            />
            <EmailControl
              autoFocus={ !email }
              classList={ boxControlClassNames }
              key={ email }
              label="Email"
              onChange={ this.onChangeEmailControl }
              status={ emailState.status }
              renderStatus={ showEmailError ? this.renderStatus(emailState) : null }
              tabIndex="1"
              text={ email }
            />
            <UsernameControl
              autoFocus={ email && email.length }
              classList={ boxControlClassNames }
              label="Username"
              onChange={ this.onChangeUsernameControl }
              placeholder="Create your username"
              status={ usernameState.status }
              renderStatus={ showUsernameError ? this.renderStatus(usernameState) : null }
              suggestions={ usernameState.suggestions }
              tabIndex="2"
            />
            <PasswordControl
              classList={ boxControlClassNames }
              label="Password"
              onChange={ this.onChangePasswordControl }
              placeholder="Set your password"
              status={ passwordState.status }
              renderStatus={ showPasswordError ? this.renderStatus(passwordState) : null }
              tabIndex="3"
            />
            <FormButton tabIndex="4" disabled={ !isValid }>Create Account</FormButton>
          </form>
          <p className="AuthenticationTermsCopy">
            By clicking Create Account you are agreeing to our <a href={ `${ENV.AUTH_DOMAIN}/wtf/post/policies` }>Terms</a>.
          </p>
        </div>
        <AppleStoreLink />
        <Credits onClick={ this.onClickTrackCredits } user={ featuredUser } />
        <Cover coverImage={ featuredUser.coverImage } modifiers="asFullScreen withOverlay" />
      </section>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    availability: state.profile.availability,
    email: state.profile.email,
    invitationCode: ownProps.params.invitationCode,
  }
}

export default connect(mapStateToProps)(Join)

