import React, { PropTypes } from 'react'
import OnboardingNavbar from './OnboardingNavbar'

const OnboardingSettings = ({ onDoneClick, onNextClick }) =>
  <div className="OnboardingSettings">
    <OnboardingNavbar
      onDoneClick={onDoneClick}
      onNextClick={onNextClick}
    />
    <div>Settings</div>
  </div>

OnboardingSettings.propTypes = {
  onDoneClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
}

export default OnboardingSettings

