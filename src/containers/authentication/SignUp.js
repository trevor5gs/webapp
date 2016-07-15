import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { random } from 'lodash'
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
    userlist: PropTypes.array,
  }

  componentWillMount() {
    const { userlist } = this.props
    const index = random(0, userlist.length - 1)
    this.state = {
      featuredUser: userlist[index],
    }
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  render() {
    const { coverDPI, coverOffset } = this.props
    const { featuredUser } = this.state
    return (
      <MainView className="Authentication">
        <div className="AuthenticationFormDialog">
          <RegistrationRequestForm />
        </div>
        <AppleStore />
        <GooglePlayStore />
        <Credits onClick={this.onClickTrackCredits} user={featuredUser} />
        <Cover
          coverDPI={coverDPI}
          coverImage={featuredUser.coverImage}
          coverOffset={coverOffset}
          modifiers="asFullScreen withOverlay"
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
    userlist: state.promotions.authentication,
  }
}

export default connect(mapStateToProps)(SignUp)

