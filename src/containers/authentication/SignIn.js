import React, { Component } from 'react'
import SignInForm from '../../components/forms/SignInForm'

class SignIn extends Component {

  render() {
    return (
      <section className="Authentication Panel">
        <h1>Peace Sign EMOJI Welcome back.</h1>
        <SignInForm/>
      </section>
    )
  }

}

export default SignIn

