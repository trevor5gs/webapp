import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import EmailControl from './EmailControl'
import PasswordControl from './PasswordControl'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
// import { requestInvite, validateEmail } from '../../actions/profile'

class SignIn extends Component {
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
    // console.log('submit', e)
    // const vo = { email: 'ryan.e.boyajian+4567@gmail.com' }
    // this.props.dispatch(requestInvite(vo))
  }

  handleControlChange(vo) {
    return vo
    // console.log('handleControlChange', vo)
  }

  render() {
    const { emailStatus, passwordStatus } = this.state
    return (
      <form id="SignIn" className="Dialog AuthenticationForm" onSubmit={this.handleSubmit.bind(this)} role="form" noValidate="novalidate">
        <EmailControl tabIndex="1" text="" placeholder="Enter Email" status={emailStatus} controlWasChanged={this.handleControlChange.bind(this)} />
        <PasswordControl tabIndex="2" placeholder="Enter Password" status={passwordStatus} controlWasChanged={this.handleControlChange.bind(this)} />
        <button className="AuthenticationButton">Enter Ello</button>
      </form>
    )
  }
}

export default connect()(SignIn)

