import React from 'react'
import classNames from 'classnames'

class Button extends React.Component {
  render() {
    const klassNames = classNames(this.props.className, this.props.classListName)
    return (
      <button {...this.props} className={klassNames} type="button">
        {this.props.children}
      </button>
    )
  }
}

Button.defaultProps = {
  classListName: 'Button',
}

export default Button

