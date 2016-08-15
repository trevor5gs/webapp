import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import OnboardingSettings from '../components/onboarding/OnboardingSettings'

class OnboardingSettingsContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
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
    return (
      <OnboardingSettings
        onDoneClick={this.onDoneClick}
        onNextClick={this.onNextClick}
      />
    )
  }

}

export default connect()(OnboardingSettingsContainer)

