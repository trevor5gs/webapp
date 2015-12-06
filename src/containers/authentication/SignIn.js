import React, { Component } from 'react'
import { Link } from 'react-router'
import random from 'lodash.random'
import { BANDEROLES } from '../../constants/gui_types'
import AppleStoreLink from '../../components/support/AppleStoreLink'
import Credits from '../../components/assets/Credits'
import NewSessionForm from '../../components/forms/NewSessionForm'

class SignIn extends Component {
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
          <h1>:e: Welcome back.</h1>
          <NewSessionForm/>
          <Link className="ForgotPasswordLink" to="/forgot-password">Forgot password?</Link>
        </div>
        <AppleStoreLink/>
        <Credits user={featuredUser} />
      </section>
    )
  }
}

export default SignIn

