import React from 'react'
import { Link } from 'react-router'
import { ElloMark } from '../iconography/ElloIcons'

class OnboardingHeader extends React.Component {
  render() {
    return (
      <header className="OnboardingHeader">
        <div className="OnboardingColumn">
          <ElloMark />
          <h1>{this.props.title}</h1>
          <p>{this.props.message}</p>
        </div>
        <div className="OnboardingColumn">
          <Link to={this.props.nextPath}>Next</Link>
          <Link to={this.props.nextPath}>Skip</Link>
        </div>
      </header>
    )
  }
}

export default OnboardingHeader

