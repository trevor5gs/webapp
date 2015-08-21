import React from 'react'
import { SVGIcon } from '../base/SVGComponents'


export class PlusIcon {
  render() {
    return (
      <SVGIcon className={this.classList()}>
        <g>
          <line x1="4.5" y1="9.5" x2="14.5" y2="9.5"/>
          <line x1="9.5" y1="14.5" x2="9.5" y2="4.5"/>
        </g>
      </SVGIcon>
    )
  }

  classList() {
    return 'PlusIcon'
  }
}


export class MinusIcon extends PlusIcon {
  classList() { return 'MinusIcon' }
}

