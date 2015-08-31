import React from 'react'
import { SVGIcon } from './SVGComponents'

// -------------------------------------

export class PlusIcon {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <line x1="4.5" y1="9.5" x2="14.5" y2="9.5"/>
          <line x1="9.5" y1="14.5" x2="9.5" y2="4.5"/>
        </g>
      </SVGIcon>
    )
  }
}

PlusIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

PlusIcon.defaultProps = {
  classListName: 'PlusIcon',
}


export class MinusIcon extends PlusIcon {
}

MinusIcon.defaultProps = {
  classListName: 'MinusIcon',
}


export class MiniPlusIcon {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <line x1="10" y1="6.5" x2="10" y2="13.5"/>
          <line x1="13.5" y1="10" x2="6.5" y2="10"/>
        </g>
      </SVGIcon>
    )
  }
}

MiniPlusIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

MiniPlusIcon.defaultProps = {
  classListName: 'MiniPlusIcon',
}


// -------------------------------------


export class ChevronIcon {
  render() {
    const { classListName } = this.props
    return (
      <SVGIcon className={classListName}>
        <g>
          <polyline points="6,16 12,10 6,4"/>
        </g>
      </SVGIcon>
    )
  }
}

ChevronIcon.propTypes = {
  classListName: React.PropTypes.string.isRequired,
}

ChevronIcon.defaultProps = {
  classListName: 'ChevronIcon',
}

