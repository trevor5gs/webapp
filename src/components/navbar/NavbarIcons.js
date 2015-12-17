import React, { Component } from 'react'
import { SVGIcon } from '../interface/SVGComponents'

export class BoltIcon extends Component {
  render() {
    return (
      <SVGIcon className="BoltIcon">
        <g>
          <polygon points="14,7.4 9,7.4 9,1 4,11.6 9,11.6 9,18" />
        </g>
      </SVGIcon>
    )
  }
}

export class CircleIcon extends Component {
  render() {
    return (
      <SVGIcon className="CircleIcon">
        <g>
          <circle cx="11" cy="11" r="5" />
        </g>
      </SVGIcon>
    )
  }
}

export class PencilIcon extends Component {
  render() {
    return (
      <SVGIcon className="PencilIcon">
        <g>
          <polygon points="12.6,4 16,7.3 7.4,15.9 4,15.9 4,12.5" />
        </g>
        <g>
          <line x1="10.2" y1="6.4" x2="13.6" y2="9.7" />
        </g>
      </SVGIcon>
    )
  }
}

export class SearchIcon extends Component {
  render() {
    return (
      <SVGIcon className="SearchIcon">
        <g>
          <circle cx="8.5" cy="8.5" r="5.5" />
        </g>
        <g>
          <path d="M12.5 12.5l4.5 4.5" />
        </g>
      </SVGIcon>
    )
  }
}

export class SparklesIcon extends Component {
  render() {
    return (
      <SVGIcon className="SparklesIcon">
        <g>
          <path d="M10,7c-2.8,0-5,2.2-5,5c0-2.8-2.2-5-5-5c2.8,0,5-2.2,5-5 C5,4.8,7.2,7,10,7z" />
        </g>
        <g>
          <path d="M15,14.5c-1.9,0-3.5,1.6-3.5,3.5c0-1.9-1.6-3.5-3.5-3.5 c1.9,0,3.5-1.6,3.5-3.5C11.5,12.9,13.1,14.5,15,14.5z" />
        </g>
        <g>
          <path d="M19,4.5c-1.9,0-3.5,1.6-3.5,3.5c0-1.9-1.6-3.5-3.5-3.5 c1.9,0,3.5-1.6,3.5-3.5C15.5,2.9,17.1,4.5,19,4.5z" />
        </g>
      </SVGIcon>
    )
  }
}

export class StarIcon extends Component {
  render() {
    return (
      <SVGIcon className="StarIcon">
        <g>
          <polygon points="10,14 13.7,16 13,11.7 16,8.6 11.9,8 10,4 8.1,8 4,8.6 7,11.7 6.3,16 "/>
        </g>
      </SVGIcon>
    )
  }
}

export class ArrowIcon extends Component {
  render() {
    return (
      <SVGIcon className="ArrowIcon">
        <g>
          <line x1="14.5" y1="10" x2="4.5" y2="10"/>
        </g>
        <g>
          <polyline points="10,5.5 14.5,10 10,14.5" />
        </g>
      </SVGIcon>
    )
  }
}

