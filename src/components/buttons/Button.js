import React from 'react'
import { mergeClassNames } from '../base/utils'

export class Button extends React.Component {
  getClassList() {
    return 'Button'
  }

  render() {
    const klasses = mergeClassNames(this.props, this.getClassList())
    return (
      <button {...this.props} className={klasses} type="button">
        {this.props.children}
      </button>
    )
  }
}

