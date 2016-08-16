import React, { PropTypes } from 'react'
import { ElloMark } from '../svg/ElloIcons'

const OnboardingNavbar = (props, context) => {
  const { counterText, isCounterSuccess, isNextDisabled } = props
  const { nextLabel = 'Continue', onDoneClick, onNextClick } = context

  return (
    <header className="OnboardingNavbar">
      <ElloMark />
      <button
        className="OnboardingNextButton RoundedButton"
        disabled={isNextDisabled}
        onClick={onNextClick}
      >
        {nextLabel}
      </button>
      {onDoneClick ?
        <button className="OnboardingDoneButton" onClick={onDoneClick} >
          I'm Done
        </button>
        : null
      }
      {counterText !== undefined ?
        <div>
          {isCounterSuccess ? <span>!</span> : null}
          {counterText ? <span>{counterText}</span> : null}
        </div> :
        null
      }
    </header>
  )
}

OnboardingNavbar.propTypes = {
  counterText: PropTypes.string,
  isCounterSuccess: PropTypes.bool,
  isNextDisabled: PropTypes.bool,
}

OnboardingNavbar.contextTypes = {
  nextLabel: PropTypes.string,
  onDoneClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
}

export default OnboardingNavbar

