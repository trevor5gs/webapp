/* eslint-disable max-len */
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

export const LinkIcon = () =>
  <SVGIcon className="DeleteIcon">
    <g>
      <path d="M9.4,10.6l-0.5-0.5c-0.6-0.6-0.6-1.5,0-2.1 L11,5.9c0.6-0.6,1.5-0.6,2.1,0l1,1c0.6,0.6,0.6,1.5,0,2.1L13,10.1"/>
      <path d="M10.6,9.4l0.5,0.5c0.6,0.6,0.6,1.5,0,2.1L9,14.1 c-0.6,0.6-1.5,0.6-2.1,0l-1-1c-0.6-0.6-0.6-1.5,0-2.1L7,9.9"/>
    </g>
  </SVGIcon>

