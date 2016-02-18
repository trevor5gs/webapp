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

export const PostIcon = () =>
  <SVGIcon className="PostIcon">
    <g>
      <line x1="14.5" x2="4.5" y1="10" y2="10"/>
    </g>
    <g>
      <polyline points="10,5.5 14.5,10 10,14.5"/>
    </g>
  </SVGIcon>

export const CancelIcon = () =>
  <SVGIcon className="CancelIcon">
    <g>
      <line x1="6" x2="14" y1="6" y2="14"/>
      <line x1="14" x2="6" y1="6" y2="14"/>
    </g>
  </SVGIcon>

export const BrowseIcon = () =>
  <SVGIcon className="BrowseIcon">
    <g>
      <rect height="8" width="8" x="4.5" y="4.5"/>
    </g>
    <g>
      <rect height="8" width="8" x="7.5" y="7.5"/>
    </g>
  </SVGIcon>

export const CameraIcon = () =>
  <SVGIcon className="CameraIcon">
    <g>
      <rect height="12" width="16" x="2.5" y="4.5"/>
    </g>
    <g>
      <circle cx="10.5" cy="10.5" r="3"/>
    </g>
  </SVGIcon>

export const LockIcon = () =>
  <SVGIcon className="LockIcon">
    <g>
      <rect x="6.5" y="8.8" width="7" height="6.6"/>
    </g>
    <g>
      <path d="M12,8.8V7c0-1.1-0.9-2-2-2S8,5.9,8,7v1.8"/>
    </g>
  </SVGIcon>

