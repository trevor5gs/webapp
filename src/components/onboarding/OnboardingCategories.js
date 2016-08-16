import React, { PropTypes } from 'react'
import { getCategories } from '../../actions/discover'
import StreamContainer from '../../containers/StreamContainer'
import OnboardingNavbar from './OnboardingNavbar'
import { MainView } from '../views/MainView'

const OnboardingCategories = ({ onDoneClick, onNextClick }) =>
  <MainView className="Onboarding OnboardingCategories">
    <h1 className="OnboardingHeading">
      <span>Pick what you're into. </span>
      <span>Slow down & check out some cool ass shit.</span>
    </h1>
    <StreamContainer
      action={getCategories()}
    />
    <OnboardingNavbar
      onDoneClick={onDoneClick}
      onNextClick={onNextClick}
    />
  </MainView>

OnboardingCategories.propTypes = {
  onDoneClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
}

export default OnboardingCategories


