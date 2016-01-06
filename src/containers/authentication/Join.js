/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import random from 'lodash.random'
import { AUTHENTICATION_PROMOTIONS } from '../../constants/promotion_types'
import { trackEvent } from '../../actions/tracking'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import RegistrationForm from '../../components/forms/RegistrationForm'
import AppleStoreLink from '../../components/support/AppleStoreLink'

class Join extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      featuredUser: null,
    }
  }

  componentWillMount() {
    const userlist = AUTHENTICATION_PROMOTIONS
    const index = random(0, userlist.length - 1)
    this.setState({ featuredUser: userlist[index] })
  }

  creditsTrackingEvent() {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  render() {
    const { featuredUser } = this.state
    return (
      <section className="Authentication Panel">
        <div className="FormDialog">
          <h1>
            <img src="/static/images/support/muscle.png" width="32" height="32" alt="muscle" />
            Be inspired.
          </h1>
          <RegistrationForm/>
          <p className="AuthenticationTermsCopy">
            By clicking Create Account you are agreeing to our <a href="https://ello.co/wtf/post/policies">Terms</a>.
          </p>
        </div>
        <AppleStoreLink/>
        <Credits clickAction={::this.creditsTrackingEvent} user={featuredUser} />
        <Cover coverImage={featuredUser.coverImage} modifiers="asFullScreen withOverlay" />
      </section>
    )
  }
}

export default connect()(Join)

