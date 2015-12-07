import React, { Component } from 'react'
import random from 'lodash.random'
import { BANDEROLES } from '../../constants/gui_types'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm'
import AppleStoreLink from '../../components/support/AppleStoreLink'

class ForgotPassword extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      featuredUser: null,
    }
  }

  componentWillMount() {
    const userlist = BANDEROLES // Just for now :)
    const index = random(0, userlist.length - 1)
    this.setState({ featuredUser: userlist[index] })
  }

  render() {
    const { featuredUser } = this.state
    return (
      <section className="Authentication Panel">
        <div className="FormDialog">
          <h1>:e: Shit happens.</h1>
          <ForgotPasswordForm/>
        </div>
        <AppleStoreLink/>
        <Credits user={featuredUser} />
        <Cover coverImage={featuredUser.coverImage} modifiers="asFullScreen" />
      </section>
    )
  }
}

export default ForgotPassword

