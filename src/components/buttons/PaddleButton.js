import React from 'react'
import { ChevronIcon } from '../iconography/Icons'

// This is duplicated code
function getClassNames(props, baseClassName = 'Button') {
  const { className } = props
  return className ? `${baseClassName} ${className}` : baseClassName
}

export class PaddleButton extends React.Component {
  render() {
    const mergedClassNames = getClassNames(this.props, this.classList())
    return (
      <button {...this.props} className={mergedClassNames} type="button">
        <ChevronIcon/>
      </button>
    )
  }
  classList() {
    return 'PaddleButton'
  }
}

