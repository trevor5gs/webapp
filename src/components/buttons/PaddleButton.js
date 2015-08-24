import React from 'react'
import { mergeClassNames } from '../base/utils'
import { ChevronIcon } from '../iconography/Icons'

export class PaddleButton extends React.Component {
  classList() {
    return 'PaddleButton'
  }
  render() {
    const klasses = mergeClassNames(this.props, this.classList())
    return (
      <button {...this.props} className={klasses} type="button">
        <ChevronIcon/>
      </button>
    )
  }
}

