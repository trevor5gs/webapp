import React from 'react'
import { mergeClassNames } from '../base/utils'

class Button extends React.Component {
  render() {
    const klasses = mergeClassNames(this.props, this.props.classListName)

    return (
      <button {...this.props} className={klasses} type="button">
        {this.props.children}
      </button>
    )
  }
}

Button.defaultProps = {
  classListName: 'Button',
}

export default Button

