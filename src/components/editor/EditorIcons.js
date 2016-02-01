import React from 'react'
import { SVGIcon } from '../interface/SVGComponents'

export const DragIcon = () =>
  <SVGIcon className="DragIcon">
    <g>
      <line x1="15" x2="5" y1="10" y2="10"/>
    </g>
    <g>
      <polyline points="7.4,13 5,10 7.4,7"/>
      <polyline points="12.6,7 15,10 12.6,13"/>
    </g>
  </SVGIcon>

export const DeleteIcon = () =>
  <SVGIcon className="DeleteIcon">
    <g>
      <line x1="6" x2="14" y1="6" y2="14"/>
      <line x1="14" x2="6" y1="6" y2="14"/>
    </g>
  </SVGIcon>

