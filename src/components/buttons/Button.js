import React from 'react'
import classNames from 'classnames'

class Button extends React.Component {
  render() {
    const { className, classListName, children } = this.props
    const klassNames = classNames(className, classListName)
    return (
      <button {...this.props} className={klassNames} type="button">
        {children}
      </button>
    )
  }
}

Button.defaultProps = {
  classListName: 'Button',
}

Button.propTypes = {
  className: React.PropTypes.string,
  classListName: React.PropTypes.string,
  children: React.PropTypes.node.isRequired,
}

export default Button

