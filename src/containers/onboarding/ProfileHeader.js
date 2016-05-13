/* eslint-disable react/prefer-stateless-function */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { trackEvent } from '../../actions/tracking'
import { openAlert, closeAlert } from '../../actions/modals'
import { saveCover } from '../../actions/profile'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import Uploader from '../../components/uploaders/Uploader'
import Cover from '../../components/assets/Cover'

class ProfileHeader extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
  }

  onClickNext = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('next-cover-picker'))
    dispatch(push('/onboarding/profile-avatar'))
  }

  onClickSkip = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('skipped-cover-picker'))
    dispatch(push('/onboarding/profile-avatar'))
  }

  render() {
    const { coverDPI, coverOffset, dispatch, profile } = this.props
    return (
      <main className="CoverPicker View" role="main">
        <OnboardingHeader
          message="Choose a header image."
          nextPath="/onboarding/profile-avatar"
          title="Customize your profile."
          nextAction={ this.onClickNext }
          skipAction={ this.onClickSkip }
        />
        <Uploader
          closeAlert={ bindActionCreators(closeAlert, dispatch) }
          message="Or drag & drop"
          openAlert={ bindActionCreators(openAlert, dispatch) }
          recommend="Recommended image size: 2560 x 1440"
          saveAction={ bindActionCreators(saveCover, dispatch) }
          title="Upload a header image"
        />
        <Cover
          coverDPI={ coverDPI }
          coverImage={ profile.coverImage }
          coverOffset={ coverOffset }
          isModifiable
        />
      </main>
    )
  }
}

const mapStateToProps = (state) => {
  const { gui, profile } = state
  return {
    coverDPI: gui.coverDPI,
    coverOffset: gui.coverOffset,
    profile,
  }
}

export default connect(mapStateToProps)(ProfileHeader)

