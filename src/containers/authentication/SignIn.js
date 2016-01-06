import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import random from 'lodash.random'
import { AUTHENTICATION_PROMOTIONS } from '../../constants/promotion_types'
import { trackEvent } from '../../actions/tracking'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import NewSessionForm from '../../components/forms/NewSessionForm'
import AppleStoreLink from '../../components/support/AppleStoreLink'

class SignIn extends Component {
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
            <img src="/static/images/support/v.png" width="32" height="32" alt="hi" />
            Welcome back.
          </h1>
          <NewSessionForm/>
          <Link className="ForgotPasswordLink" to="/forgot-password">Forgot password?</Link>
        </div>
        <AppleStoreLink/>
        <Credits clickAction={::this.creditsTrackingEvent} user={featuredUser} />
        <Cover coverImage={featuredUser.coverImage} modifiers="asFullScreen withOverlay" />
      </section>
    )
  }
}

export default connect()(SignIn)

