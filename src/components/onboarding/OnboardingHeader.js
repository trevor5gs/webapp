import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ElloMark } from '../svg/ElloIcons'

/* eslint-disable react/prefer-stateless-function */
class OnboardingHeader extends Component {

  static propTypes = {
    message: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isNextDisabled: PropTypes.bool,
    nextAction: PropTypes.func.isRequired,
    skipAction: PropTypes.func.isRequired,
  }

  render() {
    const { isNextDisabled, title, message, nextAction, skipAction } = this.props
    return (
      <header className="OnboardingHeader">
        <div className="OnboardingColumn">
          <ElloMark />
          <h1>{ title }</h1>
          <p>{ message }</p>
        </div>
        <div className="OnboardingColumn">
          <button
            className="OnboardingNextButton"
            disabled={ isNextDisabled }
            onClick={ nextAction }
          >
            Next
          </button>
          <button
            className="OnboardingSkipButton"
            onClick={ skipAction }
          >
            Skip
          </button>
        </div>
      </header>
    )
  }
}

export default connect()(OnboardingHeader)

