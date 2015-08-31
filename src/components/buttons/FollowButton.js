import React from 'react'
import classNames from 'classnames'
import { MiniPlusIcon } from '../iconography/Icons'


class FollowButton extends React.Component {
  render() {
    const { className, classListName, children } = this.props
    const klassNames = classNames(className, classListName)
    return (
      <button {...this.props} className={klassNames} type="button">
        <MiniPlusIcon />
        {children}
      </button>
    )
  }
}

FollowButton.defaultProps = {
  classListName: 'FollowButton',
}

FollowButton.propTypes = {
  className: React.PropTypes.string,
  classListName: React.PropTypes.string,
  children: React.PropTypes.node.isRequired,
}

export default FollowButton


