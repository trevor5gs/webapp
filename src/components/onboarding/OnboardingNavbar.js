import React, { PropTypes } from 'react'
import { ElloMark } from '../svg/ElloIcons'

const OnboardingNavbar = ({ isNextDisabled, nextLabel = 'Continue', onDoneClick, onNextClick }) =>
  <header className="OnboardingNavbar">
    <ElloMark />
    <button className="OnboardingNextButton" disabled={isNextDisabled} onClick={onNextClick}>
      {nextLabel}
    </button>
    <button className="OnboardingDoneButton" onClick={onDoneClick} >
      I'm Done
    </button>
  </header>

OnboardingNavbar.propTypes = {
  isNextDisabled: PropTypes.bool,
  nextLabel: PropTypes.string,
  onDoneClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
}

export default OnboardingNavbar

