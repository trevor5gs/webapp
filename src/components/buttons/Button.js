import React from 'react'
import { mergeClassNames } from '../base/utils'

export class Button extends React.Component {
  displayName() {
    return 'Button'
  }

  render() {
    const klasses = mergeClassNames(this.props, this.displayName())
    return (
      <button {...this.props} className={klasses} type="button">
        {this.props.children}
      </button>
    )
  }
}

