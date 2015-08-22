import React from 'react'
import { mergeClassNames } from '../base/utils'

export class Button extends React.Component {
  render() {
    const klasses = mergeClassNames(this.props, this.classList())
    return (
      <button {...this.props} className={klasses} type="button">
        {this.props.children}
      </button>
    )
  }
  classList() {
    return 'Button'
  }
}

