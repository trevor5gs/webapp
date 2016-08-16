import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import OnboardingInvitations from '../components/onboarding/OnboardingInvitations'

class OnboardingInvitationsContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    nextLabel: PropTypes.string,
    onDoneClick: PropTypes.func.isRequired,
    onNextClick: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      nextLabel: 'Get To The Goods',
      onDoneClick: this.onDoneClick,
      onNextClick: this.onNextClick,
    }
  }

  onDoneClick = () => {
    const { dispatch } = this.props
    dispatch(push('/'))
  }

  onNextClick = () => {
    const { dispatch } = this.props
    dispatch(push('/'))
  }

  render() {
    return <OnboardingInvitations />
  }

}

export default connect()(OnboardingInvitationsContainer)

