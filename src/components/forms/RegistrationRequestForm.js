import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { requestInvite/* , checkAvailability */ } from '../../actions/profile'
import FormButton from '../forms/FormButton'
import EmailControl from '../forms/EmailControl'

class RegistrationRequestForm extends Component {
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
    this.handleEmailControlChanged = debounce(this.handleEmailControlChanged, 500)
  }

  componentWillReceiveProps(nextProps) {
    const { availability } = nextProps
    if (availability && availability.hasOwnProperty('email')) {
      this.onValidateEmailResponse(availability)
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

  handleEmailControlChanged(vo) {
    const { emailStatus } = this.state
    if (!vo.email.length && emailStatus !== STATUS.INDETERMINATE) {
      return this.setState({ emailStatus: STATUS.INDETERMINATE, emailSuggestion: null })
    }
    if (emailStatus !== STATUS.REQUEST) {
      this.setState({ emailStatus: STATUS.REQUEST, emailSuggestion: null })
    }
    // this.props.dispatch(checkAvailability(vo))
    // TODO: this is temporary until availability endpoints are public
    if (vo.email.match(/(.+)@(.+)\.([a-z]{2,})/)) {
      this.setState({ emailStatus: STATUS.SUCCESS, emailSuggestion: null })
    } else {
      this.setState({ emailStatus: STATUS.FAILURE, emailSuggestion: null })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { emailStatus } = this.state
    if (emailStatus === STATUS.SUCCESS) {
      this.props.dispatch(requestInvite(this.refs.emailControl.refs.input.value))
      this.setState({ emailStatus: STATUS.SUBMITTED, emailSuggestion: null })
    }
  }

  render() {
    const { emailStatus, emailSuggestion } = this.state
    const isFormValid = emailStatus === STATUS.SUCCESS
    const wasSubmitted = emailStatus === STATUS.SUBMITTED
    return wasSubmitted ?
      <div>Please check your email to join Ello.</div> :
      <form id="RegistrationRequestForm" className="AuthenticationForm" onSubmit={::this.handleSubmit} role="form" noValidate="novalidate">
        <EmailControl ref="emailControl" tabIndex="1" text="" status={emailStatus} suggestions={emailSuggestion} controlWasChanged={::this.handleEmailControlChanged} />
        <FormButton tabIndex="2" disabled={!isFormValid}>Sign up</FormButton>
      </form>
  }
}

function mapStateToProps(state) {
  return {
    availability: state.profile.availability,
  }
}

export default connect(mapStateToProps)(RegistrationRequestForm)

