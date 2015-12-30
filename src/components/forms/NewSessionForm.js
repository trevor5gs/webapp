import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { getUserCredentials } from '../../actions/authentication'
import FormButton from '../forms/FormButton'
import EmailControl from '../forms/EmailControl'
import PasswordControl from '../forms/PasswordControl'

class NewSessionForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      emailStatus: STATUS.INDETERMINATE,
      passwordStatus: STATUS.INDETERMINATE,
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(getUserCredentials(this.refs.emailControl.refs.input.value, this.refs.passwordControl.refs.input.value))
  }

  render() {
    const { emailStatus, passwordStatus } = this.state
    return (
      <form id="NewSessionForm" className="AuthenticationForm" onSubmit={::this.handleSubmit} role="form" noValidate="novalidate">
        <EmailControl ref="emailControl" tabIndex="1" text="" status={emailStatus} />
        <PasswordControl ref="passwordControl" tabIndex="2" status={passwordStatus} />
        <FormButton tabIndex="3">Enter Ello</FormButton>
      </form>
    )
  }
}

export default connect()(NewSessionForm)

