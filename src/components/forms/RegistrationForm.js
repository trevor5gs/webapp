import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { /* requestInvite,*/ checkAvailability } from '../../actions/profile'
import FormButton from '../forms/FormButton'
import EmailControl from '../forms/EmailControl'
import PasswordControl from '../forms/PasswordControl'
import UsernameControl from '../forms/UsernameControl'

class RegistrationForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      emailStatus: STATUS.INDETERMINATE,
      emailSuggestion: null,
      passwordStatus: STATUS.INDETERMINATE,
      showPasswordSuggestion: true,
      showUsernameAdvice: true,
      usernameFailureType: null,
      usernameSuggestions: null,
      usernameStatus: STATUS.INDETERMINATE,
    }
  }

  componentWillMount() {
    this.handleEmailControlChanged = debounce(this.handleEmailControlChanged, 500)
    this.handleUsernameControlChanged = debounce(this.handleUsernameControlChanged, 500)
  }

  componentWillReceiveProps(nextProps) {
    const { availability } = nextProps
    if (availability.hasOwnProperty('email')) {
      this.onValidateEmailResponse(availability)
    }
    if (availability.hasOwnProperty('username')) {
      this.onValidateUsernameResponse(availability)
    }
  }

  onValidateEmailResponse(availability) {
    const { emailStatus } = this.state
    if (!availability && emailStatus !== STATUS.FAILURE) {
      return this.setState({ emailStatus: STATUS.FAILURE, emailSuggestion: null })
    }
    const { email, suggestions } = availability
    const emailFullSuggestion = suggestions.email && suggestions.email.full && suggestions.email.full.length ? suggestions.email.full : null
    if (email && emailStatus !== STATUS.SUCCESS) {
      return this.setState({ emailStatus: STATUS.SUCCESS, emailSuggestion: emailFullSuggestion })
    } else if (!email && emailStatus !== STATUS.FAILURE) {
      return this.setState({ emailStatus: STATUS.FAILURE, emailSuggestion: emailFullSuggestion })
    }
  }

  onValidateUsernameResponse(availability) {
    const { usernameStatus } = this.state
    if (!availability && usernameStatus !== STATUS.FAILURE) {
      return this.setState({ usernameStatus: STATUS.FAILURE, usernameFailureType: 'server' })
    }
    const { username, suggestions } = availability
    const suggestionList = suggestions.username && suggestions.username.length ? suggestions.username : null
    if (username && usernameStatus !== STATUS.SUCCESS) {
      return this.setState({ usernameStatus: STATUS.SUCCESS, usernameFailureType: null, showUsernameAdvice: false, usernameSuggestions: suggestionList })
    } else if (!username && usernameStatus !== STATUS.FAILURE) {
      return this.setState({ usernameStatus: STATUS.FAILURE, usernameFailureType: 'server', showUsernameAdvice: false, usernameSuggestions: suggestionList })
    }
  }

  handleUsernameControlChanged(vo) {
    const { usernameStatus } = this.state
    if (!vo.username.length && usernameStatus !== STATUS.INDETERMINATE) {
      return this.setState({ usernameStatus: STATUS.INDETERMINATE, usernameFailureType: null, showUsernameAdvice: true, usernameSuggestions: null })
    }
    // Check for proper characters first
    if (!(/^[a-zA-Z0-9\-_]+$/).test(vo.username)) {
      return this.setState({ usernameStatus: STATUS.FAILURE, usernameFailureType: 'client', showUsernameAdvice: false, usernameSuggestions: null })
    }
    if (usernameStatus !== STATUS.REQUEST) {
      this.setState({ usernameStatus: STATUS.REQUEST, usernameFailureType: null, showUsernameAdvice: true, usernameSuggestions: null })
    }
    this.props.dispatch(checkAvailability(vo))
  }

  handleEmailControlChanged(vo) {
    const { emailStatus } = this.state
    if (!vo.email.length && emailStatus !== STATUS.INDETERMINATE) {
      return this.setState({ emailStatus: STATUS.INDETERMINATE, emailSuggestion: null })
    }
    if (emailStatus !== STATUS.REQUEST) {
      this.setState({ emailStatus: STATUS.REQUEST, emailSuggestion: null })
    }
    this.props.dispatch(checkAvailability(vo))
  }

  handlePasswordControlChanged(vo) {
    const { passwordStatus } = this.state
    if (!vo.password.length && passwordStatus !== STATUS.INDETERMINATE) {
      return this.setState({ passwordStatus: STATUS.INDETERMINATE, showPasswordSuggestion: false })
    }

    const status = (/^.{8,128}$/).test(vo.password) ? STATUS.SUCCESS : STATUS.FAILURE
    if (passwordStatus !== status) {
      this.setState({ passwordStatus: status, showPasswordSuggestion: status !== STATUS.SUCCESS })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    // console.log('submit', e)
    // const vo = { email: 'ryan.e.boyajian+4567@gmail.com' }
    // this.props.dispatch(requestInvite(vo))
  }

  render() {
    const { usernameStatus, usernameFailureType, showUsernameAdvice, usernameSuggestions, emailStatus, emailSuggestion, passwordStatus, showPasswordSuggestion } = this.state
    const isFormValid = usernameStatus === STATUS.SUCCESS && emailStatus === STATUS.SUCCESS && passwordStatus === STATUS.SUCCESS
    return (
      <form id="RegistrationForm" className="AuthenticationForm" onSubmit={::this.handleSubmit} role="form" noValidate="novalidate">
        <EmailControl tabIndex="1" text="" placeholder="Enter your email" status={emailStatus} suggestions={emailSuggestion} controlWasChanged={::this.handleEmailControlChanged} classModifiers="asBoxControl" />
        <UsernameControl tabIndex="2" text="" placeholder="Create your username" status={usernameStatus} failureType={usernameFailureType} showAdvice={showUsernameAdvice} suggestions={usernameSuggestions} controlWasChanged={::this.handleUsernameControlChanged} classModifiers="asBoxControl" />
        <PasswordControl tabIndex="3" placeholder="Set your password" status={passwordStatus} showSuggestion={showPasswordSuggestion} controlWasChanged={::this.handlePasswordControlChanged} classModifiers="asBoxControl" />
        <FormButton tabIndex="4" disabled={!isFormValid}>Create Account</FormButton>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    availability: state.profile.availability,
  }
}

export default connect(mapStateToProps)(RegistrationForm)

