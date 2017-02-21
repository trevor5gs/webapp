import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import OnboardingInvitations from '../components/onboarding/OnboardingInvitations'

class OnboardingInvitationsContainer extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    nextLabel: PropTypes.string,
    onNextClick: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      nextLabel: 'Get To The Goods',
      onNextClick: this.onNextClick,
    }
  }

  onNextClick = () => {
    const { dispatch } = this.props
    dispatch(push('/following'))
  }

  render() {
    return <OnboardingInvitations />
  }

}

export default connect()(OnboardingInvitationsContainer)

