import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import EmailControl from './EmailControl'
import debounce from 'lodash.debounce'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
// import { requestInvite, validateEmail } from '../../actions/profile'

class SignUpForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      emailStatus: STATUS.INDETERMINATE,
      emailSuggestion: null,
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

  handleSubmit(e) {
    e.preventDefault()
    // console.log('submit', e)
    // const vo = { email: 'ryan.e.boyajian+4567@gmail.com' }
    // this.props.dispatch(requestInvite(vo))
  }

  render() {
    const { emailStatus, emailSuggestion } = this.state
    return (
      <form id="SignUpForm" className="Dialog AuthenticationForm" onSubmit={this.handleSubmit.bind(this)} role="form" noValidate="novalidate">
        <EmailControl tabIndex="2" text="" status={emailStatus} suggestions={emailSuggestion} controlWasChanged={this.validateEmail.bind(this)} />
        <button className="AuthenticationButton">Sign up</button>
      </form>
    )
  }
}

export default connect()(SignUpForm)

