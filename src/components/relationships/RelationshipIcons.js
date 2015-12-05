import React, { Component } from 'react'
import { SVGIcon } from '../interface/SVGComponents'

export class MiniPlusIcon extends Component {
  render() {
    return (
      <SVGIcon className="MiniPlusIcon">
        <g>
          <line x1="10.5" x2="10.5" y1="6.5" y2="12.5"/>
          <line x1="13.5" x2="7.5" y1="9.5" y2="9.5"/>
        </g>
      </SVGIcon>
    )
  }
}

export class MiniCheckIcon extends Component {
  render() {
    return (
      <SVGIcon className="MiniCheckIcon">
        <g>
          <polyline points="7,10.4 9.5,13.5 13,7.5" />
        </g>
      </SVGIcon>
    )
  }
}

