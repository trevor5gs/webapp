import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { sample } from 'lodash'
import { isAndroid } from '../../vendor/jello'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { sendForgotPasswordRequest } from '../../actions/authentication'
import { trackEvent } from '../../actions/tracking'
import { AppleStore, GooglePlayStore } from '../../components/assets/AppStores'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import Emoji from '../../components/assets/Emoji'
import EmailControl from '../../components/forms/EmailControl'
import FormButton from '../../components/forms/FormButton'
import { isFormValid, getEmailStateFromClient } from '../../components/forms/Validators'
import { MainView } from '../../components/views/MainView'

class ForgotPassword extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    promotions: PropTypes.array.isRequired,
  }

  componentWillMount() {
    this.state = {
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      formStatus: STATUS.INDETERMINATE,
    }
    this.emailValue = ''
  }

  onBlurControl = () => {
    if (isAndroid()) {
      document.body.classList.remove('hideCredits')
    }
  }

  onChangeControl = ({ email }) => {
    this.emailValue = email
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: email, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  onFocusControl = () => {
    if (isAndroid()) {
      document.body.classList.add('hideCredits')
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: this.emailValue, currentStatus })
    if (newState.status === STATUS.SUCCESS) {
      dispatch(sendForgotPasswordRequest(this.emailValue))
      this.setState({ formStatus: STATUS.SUBMITTED })
    } else if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  renderSubmitted() {
    return (
      <div>
        If your email address exists in our database, you will receive a
        password recovery link at your email address in a few minutes.
      </div>
    )
  }

  renderForm() {
    const { emailState } = this.state
    const isValid = isFormValid([emailState])
    return (
      <form
        className="AuthenticationForm"
        id="ForgotPasswordForm"
        noValidate="novalidate"
        onSubmit={this.onSubmit}
        role="form"
      >
        <EmailControl
          classList="asBoxControl"
          label="Email"
          onBlur={this.onBlurControl}
          onChange={this.onChangeControl}
          onFocus={this.onFocusControl}
          tabIndex="1"
        />
        {emailState.message ?
          <p className="HoppyStatusMessage hasContent">{emailState.message}</p> :
          <p className="HoppyStatusMessage"><span /></p>
        }
        <FormButton disabled={!isValid} tabIndex="2">Reset password</FormButton>
      </form>
    )
  }

  render() {
    const { coverDPI, coverOffset, promotions } = this.props
    const { formStatus } = this.state
    const promotion = sample(promotions)
    return (
      <MainView className="Authentication">
        <div className="AuthenticationFormDialog">
          <h1>
            <Emoji name="hot_shit" title="It really does" size={32} />
            Shit happens.
          </h1>
          {formStatus === STATUS.SUBMITTED ? this.renderSubmitted() : this.renderForm()}
        </div>
        <AppleStore />
        <GooglePlayStore />
        <Credits onClick={this.onClickTrackCredits} user={promotion} />
        <Cover
          coverDPI={coverDPI}
          coverImage={promotion ? promotion.coverImage : null}
          coverOffset={coverOffset}
          modifiers="asFullScreen withOverlay"
        />
      </MainView>
    )
  }
}

const mapStateToProps = (state) => {
  const { gui } = state
  return {
    coverDPI: gui.coverDPI,
    coverOffset: gui.coverOffset,
    promotions: state.promotions.authentication,
  }
}

export default connect(mapStateToProps)(ForgotPassword)

