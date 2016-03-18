import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { push } from 'react-router-redux'
import classNames from 'classnames'
import { trackEvent } from '../../actions/tracking'
import { ElloMark } from '../interface/ElloIcons'

/* eslint-disable react/prefer-stateless-function */
class OnboardingHeader extends Component {

  static propTypes = {
    batchSave: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
    lockNext: PropTypes.bool,
    message: PropTypes.string.isRequired,
    nextPath: PropTypes.string.isRequired,
    redirection: PropTypes.bool,
    relationshipMap: PropTypes.object,
    title: PropTypes.string.isRequired,
    trackingLabel: PropTypes.string.isRequired,
  }

  onClickNext = () => {
    const {
      dispatch,
      batchSave,
      relationshipMap,
      trackingLabel,
      redirection,
      nextPath,
    } = this.props
    dispatch(trackEvent(`completed-${trackingLabel}`))

    // Save any relationships created...
    if (!batchSave && !relationshipMap) { return }

    const { following, inactive } = relationshipMap

    if (!following && !inactive) { return }

    const followingLength = following.length
    const inactiveLength = inactive.length

    if (followingLength) {
      const followingIds = following.map((user) => user.id)
      this.props.batchSave(followingIds, 'friend')
    }

    if (inactiveLength) {
      const inactiveIds = inactive.map((user) => user.id)
      this.props.batchSave(inactiveIds, 'inactive')
    }

    if (followingLength > 0 && inactiveLength === 0) {
      dispatch(trackEvent(`followed-all-${trackingLabel}`))
    } else if (followingLength === 0 && inactiveLength > 0) {
      dispatch(trackEvent(`unfollowed-all-${trackingLabel}`))
    } else {
      dispatch(trackEvent(`followed-some-${trackingLabel}`))
    }

    if (redirection) {
      dispatch(push(nextPath))
    }
  }

  onClickSkip = () => {
    const { dispatch, trackingLabel, nextPath, redirection } = this.props
    dispatch(trackEvent(`skipped-${trackingLabel}`))
    if (redirection) {
      dispatch(push(nextPath))
    }
  }

  getButtonClassNames() {
    const { lockNext, relationshipMap } = this.props
    if (lockNext && relationshipMap) {
      return classNames(
      'OnboardingNextButton',
      { isDisabled: relationshipMap && !relationshipMap.following.length },
      )
    }
    return classNames('OnboardingNextButton')
  }

  render() {
    const { title, message, nextPath } = this.props
    return (
      <header className="OnboardingHeader">
        <div className="OnboardingColumn">
          <ElloMark />
          <h1>{ title }</h1>
          <p>{ message }</p>
        </div>
        <div className="OnboardingColumn">
          <Link
            className={ this.getButtonClassNames() }
            to={ nextPath }
            onClick={ this.onClickNext }
          >
            Next
          </Link>
          <Link
            className="OnboardingSkipButton"
            to={ nextPath }
            onClick={ this.onClickSkip }
          >
            Skip
          </Link>
        </div>
      </header>
    )
  }
}

export default connect()(OnboardingHeader)

