import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import { ElloMark } from '../iconography/ElloIcons'

class OnboardingHeader extends React.Component {
  render() {
    const { title, message, nextPath, relationshipMap } = this.props
    const nextButtonClassnames = classNames(
      'Button',
      { isDisabled: relationshipMap.following.length > 0 ? false : true },
    )
    return (
      <header className="OnboardingHeader">
        <div className="OnboardingColumn">
          <ElloMark />
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
        <div className="OnboardingColumn">
          <Link className={nextButtonClassnames} to={nextPath}>Next</Link>
          <p>
            <Link to={nextPath}>Skip</Link>
          </p>
        </div>
      </header>
    )
  }
}

OnboardingHeader.propTypes = {
  title: React.PropTypes.string.isRequired,
  message: React.PropTypes.string.isRequired,
  nextPath: React.PropTypes.string.isRequired,
  relationshipMap: React.PropTypes.any.isRequired,
}

export default OnboardingHeader

