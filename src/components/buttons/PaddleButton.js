import React from 'react'
import classNames from 'classnames'
import { ChevronIcon } from '../iconography/Icons'

class PaddleButton extends React.Component {
  render() {
    const klassNames = classNames(this.props.className, this.props.classListName)
    return (
      <button {...this.props} className={klassNames} type="button">
        <ChevronIcon/>
      </button>
    )
  }
}

PaddleButton.defaultProps = {
  classListName: 'PaddleButton',
}

export default PaddleButton

