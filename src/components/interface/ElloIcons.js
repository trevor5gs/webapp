/* eslint-disable max-len */
import React from 'react'
import { SVGBox } from './SVGComponents'

// )
const fortyPointSmilePath = () =>
  <path d="M20.5 32c-5.5 0-10.2-3.7-11.6-9-.2-.6.2-1.2.8-1.4.6-.2 1.2.2 1.4.8 1.1 4.3 5 7.3 9.4 7.3s8.3-3 9.4-7.3c.2-.6.8-1 1.4-.8.6.2 1 .8.8 1.4-1.3 5.3-6.1 9-11.6 9z" />

export const ElloMark = () =>
  <SVGBox className="ElloMark">
    <path d="M0 0h40v40h-40z" />
    { fortyPointSmilePath() }
  </SVGBox>

export const ElloBoxMark = () =>
  <SVGBox className="ElloBoxMark">
    <path d="M0 0h40v40h-40z" />
    { fortyPointSmilePath() }
  </SVGBox>

export const ElloRainbowMark = () =>
  <SVGBox className="ElloRainbowMark">
    <rect fill="#e31e26" y="0" width="40" height="7" />
    <rect fill="#f78c1f" y="7" width="40" height="7" />
    <rect fill="#fdec0a" y="14" width="40" height="7" />
    <rect fill="#0c8140" y="21" width="40" height="7" />
    <rect fill="#3f5fac" y="28" width="40" height="7" />
    <rect fill="#732a83" y="35" width="40" height="7" />
    { fortyPointSmilePath() }
  </SVGBox>

export const ElloDonutMark = () =>
  <SVGBox className="ElloDonutMark">
    <rect style={{ fill: '#fcc688' }} width="40" height="40" />
    <rect style={{ fill: 'white' }} x="11" y="11" width="16" height="16" />
    <path style={{ fill: '#ef628a' }} d="M38.2,19.7c0-1.8-1.1-3.4-2.7-4.1c1.2-1.4,1.5-3.4,0.5-5.1c-0.9-1.6-2.7-2.4-4.4-2.2c0.4-1.8-0.4-3.7-2.1-4.7 C27.9,2.8,25.9,3,24.5,4c-0.6-1.7-2.2-3-4.2-3c-1.8,0-3.4,1.1-4,2.7c-1.4-1.2-3.4-1.4-5-0.5C9.7,4.2,8.9,5.9,9.1,7.7 C7.3,7.3,5.4,8.1,4.4,9.7c-0.9,1.6-0.8,3.5,0.3,4.9c-1.7,0.6-3,2.2-3,4.2c0,1.9,1.1,3.4,2.7,4.1C3.3,24.3,3,26.3,4,28 c0.9,1.6,2.7,2.4,4.4,2.2C8,32,8.8,33.9,10.5,34.9c1.6,0.9,3.5,0.7,4.9-0.3c0.6,1.7,2.2,3,4.2,3c1.9,0,3.4-1.1,4.1-2.7 c1.4,1.2,3.4,1.5,5.1,0.5c1.6-0.9,2.4-2.7,2.2-4.4c1.8,0.4,3.7-0.4,4.7-2.1c0.9-1.6,0.7-3.5-0.3-4.9C37,23.3,38.2,21.7,38.2,19.7z M20,26.3c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S23.9,26.3,20,26.3z" />
    <path style={{ fill: '#fb9a4a' }} d="M20,14.1c3.6,0,6.5,2.7,6.9,6.1c0-0.3,0.1-0.6,0.1-0.9c0-3.9-3.1-7-7-7c-3.9,0-7,3.1-7,7c0,0.3,0,0.6,0.1,0.9 C13.5,16.8,16.4,14.1,20,14.1z" />
    { fortyPointSmilePath() }
  </SVGBox>

