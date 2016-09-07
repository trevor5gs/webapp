import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { isEqual, pick, sample } from 'lodash'
import { isAndroid } from '../vendor/jello'
import { FORM_CONTROL_STATUS as STATUS } from '../constants/status_types'
import { sendForgotPasswordRequest } from '../actions/authentication'
import { trackEvent } from '../actions/analytics'
import { isFormValid, getEmailStateFromClient } from '../components/forms/Validators'
import { ForgotPassword } from '../components/views/ForgotPassword'

function shouldContainerUpdate(thisProps, nextProps, thisState, nextState) {
  const pickProps = ['coverDPI', 'coverOffset']
  const thisCompare = pick(thisProps, pickProps)
  const nextCompare = pick(nextProps, pickProps)
  return !isEqual(thisCompare, nextCompare) || !isEqual(thisState, nextState)
}

function mapStateToProps(state) {
  const { gui, promotions } = state
  return {
    coverDPI: gui.coverDPI,
    coverOffset: gui.coverOffset,
    promotions: promotions.authentication,
  }
}

class ForgotPasswordContainer extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    promotions: PropTypes.array.isRequired,
  }

  componentWillMount() {
    const { promotions } = this.props
    this.state = {
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      formStatus: STATUS.INDETERMINATE,
      promotion: sample(promotions),
    }
    this.emailValue = ''
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.promotion) {
      this.setState({ promotion: sample(nextProps.promotions) })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldContainerUpdate(this.props, nextProps, this.state, nextState)
  }

  onBlurControl = () => {
    if (isAndroid()) {
      document.body.classList.remove('isCreditsHidden')
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
      document.body.classList.add('isCreditsHidden')
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

  render() {
    const { coverDPI, coverOffset } = this.props
    const { emailState, formStatus, promotion } = this.state
    return (
      <ForgotPassword
        coverDPI={coverDPI}
        coverOffset={coverOffset}
        emailState={emailState}
        isSubmitted={formStatus === STATUS.SUBMITTED}
        isFormValid={isFormValid([emailState])}
        onBlurControl={this.onBlurControl}
        onChangeControl={this.onChangeControl}
        onClickTrackCredits={this.onClickTrackCredits}
        onFocusControl={this.onFocusControl}
        onSubmit={this.onSubmit}
        promotion={promotion}
      />
    )
  }
}

export default connect(mapStateToProps)(ForgotPasswordContainer)
