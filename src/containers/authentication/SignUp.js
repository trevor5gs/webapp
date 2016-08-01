import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { sample } from 'lodash'
import { trackEvent } from '../../actions/tracking'
import { AppleStore, GooglePlayStore } from '../../components/assets/AppStores'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import RegistrationRequestForm from '../../components/forms/RegistrationRequestForm'
import { MainView } from '../../components/views/MainView'

class SignUp extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    promotions: PropTypes.array.isRequired,
  }

  componentWillMount() {
    const { promotions } = this.props
    this.state = { promotion: sample(promotions) }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.promotion) {
      this.setState({ promotion: sample(nextProps.promotions) })
    }
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  render() {
    const { coverDPI, coverOffset } = this.props
    const { promotion } = this.state
    return (
      <MainView className="Authentication">
        <div className="AuthenticationFormDialog">
          <RegistrationRequestForm />
        </div>
        <AppleStore />
        <GooglePlayStore />
        <Credits onClick={this.onClickTrackCredits} user={promotion} />
        <Cover
          coverDPI={coverDPI}
          coverImage={promotion ? promotion.coverImage : null}
          coverOffset={coverOffset}
          modifiers="isFullScreen withOverlay"
        />
      </MainView>
    )
  }
}

const mapStateToProps = (state) => {
  const { gui } = state
  return {
    coverDPI: gui.coverDPI,
    coverOffset: gui.coverOffset,
    promotions: state.promotions.authentication,
  }
}

export default connect(mapStateToProps)(SignUp)

