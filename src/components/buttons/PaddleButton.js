import React from 'react'
import { mergeClassNames } from '../base/utils'
import { ChevronIcon } from '../iconography/Icons'

class PaddleButton extends React.Component {
  render() {
    const klasses = mergeClassNames(this.props, this.props.classListName)

    return (
      <button {...this.props} className={klasses} type="button">
        <ChevronIcon/>
      </button>
    )
  }
}

PaddleButton.defaultProps = {
  classListName: 'PaddleButton',
}

export default PaddleButton

