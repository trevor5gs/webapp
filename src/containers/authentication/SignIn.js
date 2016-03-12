import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { replace } from 'react-router-redux'
import { random } from 'lodash'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { AUTHENTICATION_PROMOTIONS } from '../../constants/promotions/authentication'
import { getUserCredentials } from '../../actions/authentication'
import { trackEvent } from '../../actions/tracking'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import Emoji from '../../components/assets/Emoji'
import EmailControl from '../../components/forms/EmailControl'
import PasswordControl from '../../components/forms/PasswordControl'
import FormButton from '../../components/forms/FormButton'
import {
  isFormValid,
  getEmailStateFromClient,
  getPasswordState,
} from '../../components/forms/Validators'
import AppleStoreLink from '../../components/support/AppleStoreLink'

class SignIn extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    currentStream: PropTypes.string,
  }

  componentWillMount() {
    const userlist = AUTHENTICATION_PROMOTIONS
    const index = random(0, userlist.length - 1)
    this.state = {
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      featuredUser: userlist[index],
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
    }
    this.emailValue = ''
    this.passwordValue = ''
  }

  onChangeEmailControl = ({ email }) => {
    this.emailValue = email
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: email, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  onChangePasswordControl = ({ password }) => {
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

    const { currentStream, dispatch } = this.props
    const action = getUserCredentials(this.emailValue, this.passwordValue)

    const success = await dispatch(action)

    if (success) {
      dispatch(replace({ pathname: currentStream }))
    } else {
      this.setState({ failureMessage: 'No dice. Access denied.' })
    }
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  render() {
    const { emailState, passwordState, featuredUser } = this.state
    const isValid = isFormValid([emailState, passwordState])
    return (
      <section className="Authentication Panel">
        <div className="AuthenticationFormDialog">
          <h1>
            <Emoji name="v" title="Hi!" size={ 32 } />
            Welcome back.
          </h1>
          <form
            className="AuthenticationForm"
            id="NewSessionForm"
            noValidate="novalidate"
            onSubmit={ this.onSubmit }
            role="form"
          >
            <EmailControl
              classList="asBoxControl"
              label={ `Email ${emailState.message}` }
              onChange={ this.onChangeEmailControl }
              tabIndex="1"
            />
            <PasswordControl
              classList="asBoxControl"
              label={ `Password ${passwordState.message}` }
              onChange={ this.onChangePasswordControl }
              tabIndex="2"
            />
            <FormButton disabled={ !isValid } tabIndex="3">Enter Ello</FormButton>
          </form>
          <Link className="ForgotPasswordLink" to="/forgot-password">Forgot password?</Link>
        </div>
        <AppleStoreLink />
        <Credits onClick={ this.onClickTrackCredits } user={ featuredUser } />
        <Cover coverImage={ featuredUser.coverImage } modifiers="asFullScreen withOverlay" />
      </section>
    )
  }
}

const mapStateToProps = state => ({
  currentStream: state.gui.currentStream,
})

export default connect(mapStateToProps)(SignIn)
