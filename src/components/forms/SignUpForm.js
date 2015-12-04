import React from 'react'
import { connect } from 'react-redux'
import NameControl from './NameControl'
import EmailControl from './EmailControl'
import debounce from 'lodash.debounce'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
// import { requestInvite, validateEmail } from '../../actions/profile'

class SignUpForm extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      emailStatus: STATUS.FAILURE,
      emailSuggestion: null,
    }
  }

  componentWillMount() {
    this.validateEmailForm = debounce(this.validateEmailForm, 500)
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

  validateEmailForm(vo) {
    const { emailStatus } = this.state
    if (emailStatus !== 'isValidating') {
      this.setState({ emailStatus: 'isValidating', emailSuggestion: null })
    }
    console.log('validateEmail', vo)
    // this.props.dispatch(validateEmail(vo))
  }


  handleSubmit(e) {
    e.preventDefault()
    console.log('submit', e)
    // const vo = { email: 'ryan.e.boyajian+4567@gmail.com' }
    // this.props.dispatch(requestInvite(vo))
  }

  handleControlChange(vo) {
    console.log('handleControlChange', vo)
  }

  render() {
    const { emailStatus, emailSuggestion } = this.state
    return (
      <form id="SignUpForm" className="Dialog AuthenticationForm" onSubmit={this.handleSubmit.bind(this)} role="form" noValidate="novalidate">
        <NameControl tabIndex="1" text="Name!" controlWasChanged={this.handleControlChange.bind(this)} />
        <EmailControl tabIndex="2" text="" status={emailStatus} suggestions={emailSuggestion} controlWasChanged={this.validateEmailForm.bind(this)} />
        <button className="AuthenticationButton">Create Account</button>
      </form>
    )
  }
}

SignUpForm.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
}

export default connect()(SignUpForm)

