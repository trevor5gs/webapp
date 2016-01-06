import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { getUserCredentials } from '../../actions/authentication'
import FormButton from '../forms/FormButton'
import EmailControl from '../forms/EmailControl'
import PasswordControl from '../forms/PasswordControl'

class NewSessionForm extends Component {

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
    const { emailControl, passwordControl } = this.refs
    dispatch(getUserCredentials(emailControl.refs.input.value, passwordControl.refs.input.value))
  }

  render() {
    const { emailStatus, passwordStatus } = this.state
    return (
      <form
        id="NewSessionForm"
        className="AuthenticationForm"
        onSubmit={::this.handleSubmit}
        role="form"
        noValidate="novalidate"
      >
        <EmailControl
          ref="emailControl"
          tabIndex="1"
          text=""
          status={emailStatus}
          classModifiers="asBoxControl"
        />
        <PasswordControl
          ref="passwordControl"
          tabIndex="2"
          status={passwordStatus}
          classModifiers="asBoxControl"
        />
        <FormButton tabIndex="3">Enter Ello</FormButton>
      </form>
    )
  }
}

NewSessionForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default connect()(NewSessionForm)

