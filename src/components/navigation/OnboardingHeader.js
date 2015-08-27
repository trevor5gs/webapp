import React from 'react'
import { Link } from 'react-router'
import { ElloMark } from '../iconography/ElloIcons'

class OnboardingHeader extends React.Component {
  render() {
    const { title, message, nextPath } = this.props
    return (
      <header className="OnboardingHeader">
        <div className="OnboardingColumn">
          <ElloMark />
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
        <div className="OnboardingColumn">
          <Link className="Button" to={nextPath}>Next</Link>
          <p>
            <Link to={nextPath}>Skip</Link>
          </p>
        </div>
      </header>
    )
  }
}

OnboardingHeader.propTypes = {
  shortcuts: React.PropTypes.object.isRequired,
}

export default OnboardingHeader

OnboardingHeader.propTypes = {
  title: React.PropTypes.string.isRequired,
  message: React.PropTypes.string.isRequired,
  nextPath: React.PropTypes.string.isRequired,
}

