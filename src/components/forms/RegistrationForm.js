import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
// import { requestInvite, validateEmail } from '../../actions/profile'
import FormButton from '../forms/FormButton'
import EmailControl from '../forms/EmailControl'
import PasswordControl from '../forms/PasswordControl'
import NameControl from '../forms/NameControl'

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
    }
  }

  componentWillMount() {
    this.validateEmail = debounce(this.validateEmail, 500)
  }

  // Todo: Needs to be wired up still
  onValidateEmailResponse(json) {
    const { availability } = json
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

  validateEmail(vo) {
    const { emailStatus } = this.state
    if (!vo.email.length && emailStatus !== STATUS.INDETERMINATE) {
      return this.setState({ emailStatus: STATUS.INDETERMINATE, emailSuggestion: null })
    }

    if (emailStatus !== STATUS.REQUEST) {
      this.setState({ emailStatus: STATUS.REQUEST, emailSuggestion: null })
    }
    // console.log('validateEmail', vo)
    // this.props.dispatch(validateEmail(vo))
  }

  validatePassword(vo) {
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

  handleControlChange(vo) {
    return vo
    // console.log('handleControlChange', vo)
  }

  render() {
    const { emailStatus, emailSuggestion, passwordStatus, showPasswordSuggestion } = this.state
    return (
      <form id="RegistrationForm" className="AuthenticationForm" onSubmit={this.handleSubmit.bind(this)} role="form" noValidate="novalidate">
        <NameControl tabIndex="1" text="@username" controlWasChanged={this.handleControlChange.bind(this)} />
        <EmailControl tabIndex="2" text="" status={emailStatus} suggestions={emailSuggestion} controlWasChanged={this.validateEmail.bind(this)} />
        <PasswordControl tabIndex="3" status={passwordStatus} showSuggestion={showPasswordSuggestion} controlWasChanged={this.validatePassword.bind(this)} />
        <FormButton>Create Account</FormButton>
      </form>
    )
  }
}

export default connect()(RegistrationForm)

