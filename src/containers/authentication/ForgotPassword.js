import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import random from 'lodash.random'
import { AUTHENTICATION_PROMOTIONS } from '../../constants/promotion_types'
import { trackEvent } from '../../actions/tracking'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm'
import AppleStoreLink from '../../components/support/AppleStoreLink'

class ForgotPassword extends Component {
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
            <img src="/static/images/support/hot_shit.png" width="32" height="32" alt="hot shit" />
            Shit happens.
          </h1>
          <ForgotPasswordForm/>
        </div>
        <AppleStoreLink/>
        <Credits clickAction={::this.creditsTrackingEvent} user={featuredUser} />
        <Cover coverImage={featuredUser.coverImage} modifiers="asFullScreen" />
      </section>
    )
  }
}

export default connect()(ForgotPassword)

