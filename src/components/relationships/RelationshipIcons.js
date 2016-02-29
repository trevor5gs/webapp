import React from 'react'
import { SVGIcon } from '../interface/SVGComponents'

export const MiniPlusIcon = () =>
  <SVGIcon className="MiniPlusIcon">
    <g>
      <line x1="10.5" x2="10.5" y1="6.5" y2="12.5"/>
      <line x1="13.5" x2="7.5" y1="9.5" y2="9.5"/>
    </g>
  </SVGIcon>

export const MiniCheckIcon = () =>
  <SVGIcon className="MiniCheckIcon">
    <g>
      <polyline points="7,10.4 9.5,13.5 13,7.5" />
    </g>
  </SVGIcon>

export const StarIcon = () =>
  <SVGIcon className="StarIcon">
    <g>
      <polygon points="10,14 13.7,16 13,11.7 16,8.6 11.9,8 10,4 8.1,8 4,8.6 7,11.7 6.3,16 "/>
    </g>
  </SVGIcon>

export const DotsIcon = () =>
  <SVGIcon className="DotsIcon">
    <g>
      <circle cx="3" cy="10" r="2.5"/>
    </g>
    <g>
      <circle cx="10" cy="10" r="2.5"/>
    </g>
    <g>
      <circle cx="17" cy="10" r="2.5"/>
    </g>
  </SVGIcon>

// Original `+` from Illustrator which is blurry on non-retina.
// We may need to show B&L this since it's a little offset
// <line x1="10" y1="7.5" x2="10" y2="12.5"/>
// <line x1="12.5" y1="10" x2="7.5" y2="10"/>
export const HeaderPlusIcon = () =>
  <SVGIcon className="MiniPlusIcon">
    <g>
      <circle cx="10.5" cy="10.5" r="7"/>
    </g>
    <g>
      <line x1="10.5" x2="10.5" y1="7.5" y2="13.5"/>
      <line x1="13.5" x2="7.5" y1="10.5" y2="10.5"/>
    </g>
  </SVGIcon>

export const HeaderCheckIcon = () =>
  <SVGIcon className="MiniCheckIcon">
    <g>
      <circle cx="10.5" cy="10.5" r="7"/>
    </g>
    <g>
      <polyline points="7.5,10 10,13 13.5,7"/>
    </g>
  </SVGIcon>

