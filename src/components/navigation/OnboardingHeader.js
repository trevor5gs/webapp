import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import { ElloMark } from '../iconography/ElloIcons'

class OnboardingHeader extends React.Component {
  componentDidMount() {
    this.leaveMethod = this.routerWillLeave.bind(this)
    this.context.router.addTransitionHook(this.leaveMethod)
  }


  componentWillUnmount() {
    this.context.router.removeTransitionHook(this.leaveMethod)
  }


  getButtonClassNames() {
    const { lockNext, relationshipMap } = this.props
    if (lockNext && relationshipMap) {
      return classNames(
      'Button',
      { isDisabled: relationshipMap && relationshipMap.following.length > 0 ? false : true },
      )
    }
    return 'Button'
  }


  routerWillLeave() {
    const { batchSave, relationshipMap } = this.props

    if (!batchSave && !relationshipMap) {
      return
    }

    const { following, inactive } = relationshipMap

    if (following && following.length) {
      const followingIds = following.map((user) => { return user.id })
      this.props.batchSave(followingIds, 'friend')
    }

    if (inactive && inactive.length) {
      const inactiveIds = inactive.map((user) => { return user.id })
      this.props.batchSave(inactiveIds, 'inactive')
    }
  }


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
          <Link className={this.getButtonClassNames()} to={nextPath}>Next</Link>
          <p>
            <Link to={nextPath}>Skip</Link>
          </p>
        </div>
      </header>
    )
  }
}

OnboardingHeader.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

OnboardingHeader.propTypes = {
  title: React.PropTypes.string.isRequired,
  message: React.PropTypes.string.isRequired,
  nextPath: React.PropTypes.string.isRequired,
  relationshipMap: React.PropTypes.object,
  batchSave: React.PropTypes.func,
  lockNext: React.PropTypes.any,
}

export default OnboardingHeader

