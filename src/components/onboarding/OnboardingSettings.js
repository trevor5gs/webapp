import React, { PropTypes } from 'react'
import OnboardingNavbar from './OnboardingNavbar'
import { MainView } from '../views/MainView'

const OnboardingSettings = ({ onDoneClick, onNextClick }) =>
  <MainView className="Onboarding OnboardingSettings">
    <h1 className="OnboardingHeading">
      <span>Grow your creative influence. </span>
      <span>Completed profiles get way more views.</span>
    </h1>
    <OnboardingNavbar
      onDoneClick={onDoneClick}
      onNextClick={onNextClick}
    />
  </MainView>

OnboardingSettings.propTypes = {
  onDoneClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
}

export default OnboardingSettings

