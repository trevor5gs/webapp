import React from 'react'
import { Link } from 'react-router'

class OnboardingHeader extends React.Component {
  render() {
    return (
      <header className="OnboardingHeader">
        <h1>{this.props.title}</h1>
        <p>{this.props.message}</p>
        <Link to={this.props.nextPath}>Next</Link>
        <Link to={this.props.nextPath}>Skip</Link>
      </header>
    )
  }
}

export default OnboardingHeader

