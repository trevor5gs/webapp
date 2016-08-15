import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import OnboardingCategories from '../components/onboarding/OnboardingCategories'

class OnboardingCategoriesContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  onDoneClick = () => {
    const { dispatch } = this.props
    dispatch(push('/'))
  }

  onNextClick = () => {
    const { dispatch } = this.props
    dispatch(push('/onboarding/settings'))
  }

  render() {
    return (
      <OnboardingCategories
        onDoneClick={this.onDoneClick}
        onNextClick={this.onNextClick}
      />
    )
  }

}

export default connect()(OnboardingCategoriesContainer)

