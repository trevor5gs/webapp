import React from 'react'
import classNames from 'classnames'
import { ChevronIcon } from '../iconography/Icons'

class PaddleButton extends React.Component {
  render() {
    const { className, classListName } = this.props
    const klassNames = classNames(className, classListName)
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

PaddleButton.propTypes = {
  className: React.PropTypes.string,
  classListName: React.PropTypes.string,
}

export default PaddleButton

