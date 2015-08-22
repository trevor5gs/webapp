import React from 'react'

// This is duplicated code
function getClassNames(props, baseClassName = 'Button') {
  const { className } = props
  return className ? `${baseClassName} ${className}` : baseClassName
}

export class Button extends React.Component {
  render() {
    const mergedClassNames = getClassNames(this.props, this.classList())

    return (
      <button {...this.props} className={mergedClassNames} type="button">
        {this.props.children}
      </button>
    )
  }
  classList() {
    return 'Button'
  }
}

