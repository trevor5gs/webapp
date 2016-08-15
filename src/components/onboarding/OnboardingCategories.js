import React, { PropTypes } from 'react'
import { getCategories } from '../../actions/discover'
import StreamContainer from '../../containers/StreamContainer'
import OnboardingNavbar from './OnboardingNavbar'

const OnboardingCategories = ({ onDoneClick, onNextClick }) =>
  <div className="OnboardingCategories">
    <OnboardingNavbar
      onDoneClick={onDoneClick}
      onNextClick={onNextClick}
    />
    <StreamContainer
      action={getCategories()}
    />
  </div>

OnboardingCategories.propTypes = {
  onDoneClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
}

export default OnboardingCategories


