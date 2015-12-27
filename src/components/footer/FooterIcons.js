import React, { Component } from 'react'
import { SVGIcon } from '../interface/SVGComponents'

export class PhoneIcon extends Component {
  render() {
    return (
      <SVGIcon className="PhoneIcon">
        <g>
          <line x1="5" y1="14.1" x2="14.7" y2="14.1"/>
          <line x1="5" y1="5.9" x2="14.7" y2="5.9"/>
          <circle cx="9.9" cy="16.3" r="0.6"/>
          <circle cx="8.2" cy="3.7" r="0.6"/>
          <path d="M14.7,16.8c0,1-0.8,1.8-1.8,1.8H6.8c-1,0-1.8-0.8-1.8-1.8V3.2c0-1,0.8-1.8,1.8-1.8H13 c1,0,1.8,0.8,1.8,1.8V16.8z"/>
          <path d="M10.4,4.2C10,4.2,9.8,4,9.8,3.7s0.3-0.6,0.6-0.6h1.1c0.3,0,0.6,0.3,0.6,0.6s-0.3,0.6-0.6,0.6 H10.4z"/>
        </g>
      </SVGIcon>
    )
  }
}

export class ChevronIcon extends Component {
  render() {
    return (
      <SVGIcon className="ChevronIcon">
        <g>
          <polyline points="5,12.2 10.2,7 15.5,12.2"/>
        </g>
      </SVGIcon>
    )
  }
}

export class ListIcon extends Component {
  render() {
    return (
      <SVGIcon className="ListIcon">
        <g>
          <rect height="12" width="12" x="4.5" y="4.5"/>
        </g>
        <g>
          <line x1="4.5" x2="16.5" y1="12.5" y2="12.5"/>
          <line x1="4.5" x2="16.5" y1="8.5" y2="8.5"/>
        </g>
      </SVGIcon>
    )
  }
}

export class GridIcon extends Component {
  render() {
    return (
      <SVGIcon className="GridIcon">
        <g>
          <rect height="12" width="12" x="4.5" y="4.5"/>
        </g>
        <g>
          <line x1="4.5" x2="16.5" y1="10.5" y2="10.5"/>
          <line x1="10.5" x2="10.5" y1="4.5" y2="16.5"/>
        </g>
      </SVGIcon>
    )
  }
}

