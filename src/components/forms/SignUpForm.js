import React from 'react'
import { connect } from 'react-redux'
import EmailControl from './EmailControl'
import debounce from 'lodash.debounce'
import { requestInvite, validateEmail } from '../../actions/profile'

class SignUpForm extends React.Component {

  componentWillMount() {
    this.validateForm = debounce(this.validateForm, 500)
  }

  validateForm(vo) {
    console.log( 'validateForm', vo )
    this.props.dispatch(validateEmail(vo))
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log('submit', e)
    const vo = { email: 'ryan.e.boyajian+4567@gmail.com' }
    this.props.dispatch(requestInvite(vo))
  }

  handleControlChange(vo) {
    this.validateForm(vo)
  }

  render() {
    return (
      <form className="Dialog SignUpForm" onSubmit={this.handleSubmit.bind(this)} role="form" noValidate="novalidate">
        <h2>Be inspired today.</h2>
        <EmailControl tabIndex="1" text="" controlWasChanged={this.handleControlChange.bind(this)} />
      </form>
    )
  }
}

SignUpForm.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
}

export default connect()(SignUpForm)

