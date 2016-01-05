import React from 'react'
import { SVGIcon } from '../interface/SVGComponents'

export const RequestIcon = () =>
  <SVGIcon className="RequestIcon">
    <g>
      <circle cx="12" cy="12" r="6" />
    </g>
  </SVGIcon>

export const SuccessIcon = () =>
  <SVGIcon className="SuccessIcon">
    <g>
      <polyline points="4.8,10.8 9.9,17 17.2,5"/>
    </g>
  </SVGIcon>

export const FailureIcon = () =>
  <SVGIcon className="FailureIcon">
    <g>
      <line x1="17" y1="5" x2="5" y2="17"/>
      <line x1="17" y1="17" x2="5" y2="5"/>
    </g>
  </SVGIcon>

