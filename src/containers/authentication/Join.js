import React, { Component } from 'react'
import random from 'lodash.random'
import { AUTHENTICATION_PROMOTIONS } from '../../constants/promotion_types'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import RegistrationForm from '../../components/forms/RegistrationForm'
import AppleStoreLink from '../../components/support/AppleStoreLink'

class Join extends Component {
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

  render() {
    const { featuredUser } = this.state
    return (
      <section className="Authentication Panel">
        <div className="FormDialog">
          <h1>:e: Be inspired today.</h1>
          <RegistrationForm/>
          <p className="AuthenticationTermsCopy">
            By clicking Create Account you are agreeing to our <a href="https://ello.co/wtf/post/policies">Terms</a>.
          </p>
        </div>
        <AppleStoreLink/>
        <Credits user={featuredUser} />
        <Cover coverImage={featuredUser.coverImage} modifiers="asFullScreen" />
      </section>
    )
  }
}

export default Join

