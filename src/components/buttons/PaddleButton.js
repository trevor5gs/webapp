import React from 'react'
import { mergeClassNames } from '../base/utils'
import { ChevronIcon } from '../iconography/Icons'

class PaddleButton extends React.Component {
  getClassList() {
    return 'PaddleButton'
  }

  render() {
    const klasses = mergeClassNames(this.props, this.getClassList())
    return (
      <button {...this.props} className={klasses} type="button">
        <ChevronIcon/>
      </button>
    )
  }
}

export default PaddleButton
