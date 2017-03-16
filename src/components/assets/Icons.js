// @flow
import React from 'react'
import classNames from 'classnames'
import { SVGBox, SVGIcon } from '../svg/SVGComponents'

// -------------------------------------
// Shapes for building icons

type Props = {
  className?: string,
}

const FillShapeForty = (props: Props) =>
  <path className={props.className} d="M0 0h40v40h-40z" />

FillShapeForty.defaultProps = {
  className: 'svg-fill',
}

const FillShapeSixty = (props: Props) =>
  <path className={props.className} d="M0 0h60v60h-60z" />

FillShapeSixty.defaultProps = {
  className: 'svg-fill',
}

const SmileShapeForty = () =>
  <path className="SmileShape" d="M20.5 32c-5.5 0-10.2-3.7-11.6-9-.2-.6.2-1.2.8-1.4.6-.2 1.2.2 1.4.8 1.1 4.3 5 7.3 9.4 7.3s8.3-3 9.4-7.3c.2-.6.8-1 1.4-.8.6.2 1 .8.8 1.4-1.3 5.3-6.1 9-11.6 9z" />

const BadgeShape = () =>
  <g className="BadgeShape svg-fill-stroke svg-stroke-round">
    <polygon points="12,1 14.2,3.8 17.5,2.5 18,6 21.5,6.5 20.2,9.8 23,12 20.2,14.2 21.5,17.5 18,18 17.5,21.5 14.2,20.2 12,23 9.8,20.2 6.5,21.5 6,18 2.5,17.5 3.8,14.2 1,12 3.8,9.8 2.5,6.5 6,6 6.5,2.5 9.8,3.8" />
  </g>

const CheckShape = () =>
  <g className="CheckShape svg-stroke svg-stroke-bevel">
    <polyline points="8,11.9 11.3,16 16,8" />
  </g>

// -------------------------------------
// Ello icons 40 x 40

export const ElloMark = (props: Props) =>
  <SVGBox className={classNames('ElloMark', props.className)}>
    <FillShapeForty className="SVGBoxBG" />
    <SmileShapeForty />
  </SVGBox>


export const ElloBoxMark = () =>
  <SVGBox className="ElloBoxMark">
    <FillShapeForty className="SVGBoxBG" />
    <SmileShapeForty />
  </SVGBox>

export const ElloRainbowMark = () =>
  <SVGBox className="ElloRainbowMark">
    <rect fill="#e31e26" y="0" width="40" height="7" />
    <rect fill="#f78c1f" y="7" width="40" height="7" />
    <rect fill="#fdec0a" y="14" width="40" height="7" />
    <rect fill="#0c8140" y="21" width="40" height="7" />
    <rect fill="#3f5fac" y="28" width="40" height="7" />
    <rect fill="#732a83" y="35" width="40" height="7" />
    <SmileShapeForty />
  </SVGBox>

export const ElloDonutMark = () =>
  <SVGBox className="ElloDonutMark">
    <rect fill="#fcc688" width="40" height="40" />
    <rect fill="#ffffff" x="11" y="11" width="16" height="16" />
    <path fill="#ef628a" d="M38.2,19.7c0-1.8-1.1-3.4-2.7-4.1c1.2-1.4,1.5-3.4,0.5-5.1c-0.9-1.6-2.7-2.4-4.4-2.2c0.4-1.8-0.4-3.7-2.1-4.7 C27.9,2.8,25.9,3,24.5,4c-0.6-1.7-2.2-3-4.2-3c-1.8,0-3.4,1.1-4,2.7c-1.4-1.2-3.4-1.4-5-0.5C9.7,4.2,8.9,5.9,9.1,7.7 C7.3,7.3,5.4,8.1,4.4,9.7c-0.9,1.6-0.8,3.5,0.3,4.9c-1.7,0.6-3,2.2-3,4.2c0,1.9,1.1,3.4,2.7,4.1C3.3,24.3,3,26.3,4,28 c0.9,1.6,2.7,2.4,4.4,2.2C8,32,8.8,33.9,10.5,34.9c1.6,0.9,3.5,0.7,4.9-0.3c0.6,1.7,2.2,3,4.2,3c1.9,0,3.4-1.1,4.1-2.7 c1.4,1.2,3.4,1.5,5.1,0.5c1.6-0.9,2.4-2.7,2.2-4.4c1.8,0.4,3.7-0.4,4.7-2.1c0.9-1.6,0.7-3.5-0.3-4.9C37,23.3,38.2,21.7,38.2,19.7z M20,26.3c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S23.9,26.3,20,26.3z" />
    <path fill="#fb9a4a" d="M20,14.1c3.6,0,6.5,2.7,6.9,6.1c0-0.3,0.1-0.6,0.1-0.9c0-3.9-3.1-7-7-7c-3.9,0-7,3.1-7,7c0,0.3,0,0.6,0.1,0.9 C13.5,16.8,16.4,14.1,20,14.1z" />
    <SmileShapeForty />
  </SVGBox>

export const ElloOutlineMark = () =>
  <SVGBox className="ElloOutlineMark">
    <FillShapeForty className="svg-fill-transparent" />
    <SmileShapeForty />
  </SVGBox>

// Modifier overlays on top of any logo marks
export const ElloNinjaSuit = () =>
  <svg className="ElloNinjaSuit" height="40" width="48">
    <path d="M5.6,6.2C3.8,8,2.4,10.2,1.4,12.7h44.2l-3.1-3.2l3.1-3.2H5.6z" />
  </svg>

// -------------------------------------
// Badge icons 24 x 24

export const BadgeCheckIcon = () =>
  <SVGBox className="BadgeCheckIcon" size="24">
    <BadgeShape />
    <CheckShape />
  </SVGBox>

// -------------------------------------
// SVG icons 20 x 20

export const ArrowIcon = () =>
  <SVGIcon className="ArrowIcon">
    <g>
      <line x1="14.5" x2="4.5" y1="10" y2="10" />
    </g>
    <g>
      <polyline points="10,5.5 14.5,10 10,14.5" />
    </g>
  </SVGIcon>

export const BoltIcon = () =>
  <SVGIcon className="BoltIcon">
    <g className="svg-stroke-bevel">
      <polygon points="14,7.4 9,7.4 9,1 4,11.6 9,11.6 9,18" />
    </g>
  </SVGIcon>

export const BubbleIcon = () =>
  <SVGIcon className="BubbleIcon">
    <g className="svg-stroke-round">
      <path d="M6.6,12.6l-3.1,3.1 l0-10.3c0-0.7,0.5-1.2,1.2-1.2h10.6c0.7,0,1.2,0.5,1.2,1.2v6c0,0.7-0.5,1.2-1.2,1.2H6.6z" />
    </g>
    <g className="svg-stroke-round">
      <path d="M3.5,11.4v-6c0-0.7,0.5-1.2,1.2-1.2 h10.6c0.7,0,1.2,0.5,1.2,1.2v6c0,0.7-0.5,1.2-1.2,1.2H4.7C4,12.6,3.5,12.1,3.5,11.4z" />
      <polygon points=" 6.6,12.6 3.5,15.8 3.5,11.6 " />
    </g>
  </SVGIcon>

export const CheckIcon = () =>
  <SVGIcon className="CheckIcon">
    <CheckShape />
  </SVGIcon>

export const CheckIconHeader = () =>
  <SVGIcon className="CheckIconMini">
    <g>
      <circle cx="10.5" cy="10.5" r="7" />
    </g>
    <g>
      <polyline points="7.5,10 10,13 13.5,7" />
    </g>
  </SVGIcon>

export const CheckIconMini = () =>
  <SVGIcon className="CheckIconMini">
    <g>
      <polyline points="7,10.4 9.5,13.5 13,7.5" />
    </g>
  </SVGIcon>

export const ChevronIcon = () =>
  <SVGIcon className="ChevronIcon">
    <g>
      <polyline points="5,12.2 10.2,7 15.5,12.2" />
    </g>
  </SVGIcon>

export const CircleIcon = () =>
  <SVGIcon className="CircleIcon">
    <g>
      <circle cx="11" cy="11" r="5" />
    </g>
  </SVGIcon>

export const DotsIcon = () =>
  <SVGIcon className="DotsIcon">
    <g>
      <circle cx="3" cy="10" r="2.5" />
    </g>
    <g>
      <circle cx="10" cy="10" r="2.5" />
    </g>
    <g>
      <circle cx="17" cy="10" r="2.5" />
    </g>
  </SVGIcon>

export const EyeIcon = () =>
  <SVGIcon className="EyeIcon">
    <g>
      <path d="M19,9.9c0,0-4,4.9-9,4.9S1,9.9,1,9.9S5,5,10,5 S19,9.9,19,9.9z" />
      <circle cx="10" cy="10" r="5" />
    </g>
    <circle cx="10" cy="10" r="2" />
  </SVGIcon>

export const FailureIcon = () =>
  <SVGIcon className="FailureIcon">
    <g>
      <line x1="17" y1="5" x2="5" y2="17" />
      <line x1="17" y1="17" x2="5" y2="5" />
    </g>
  </SVGIcon>

export const FlagIcon = () =>
  <SVGIcon className="FlagIcon">
    <g className="svg-stroke-round">
      <line x1="5" y1="3.7" x2="5" y2="16.8" />
    </g>
    <g className="svg-stroke-round">
      <path d="M15,10.2 c0,0-2.9,1.1-5,0s-5,0-5,0V3.7c0,0,2.9-1.1,5,0s5,0,5,0V10.2z" />
    </g>
  </SVGIcon>

export const GridIcon = () =>
  <SVGIcon className="GridIcon">
    <g>
      <circle cx="6.2" cy="6.2" r="2.5" />
      <circle cx="13.8" cy="6.2" r="2.5" />
      <circle cx="6.2" cy="13.8" r="2.5" />
      <circle cx="13.8" cy="13.8" r="2.5" />
    </g>
  </SVGIcon>

export const HeartIcon = () =>
  <SVGIcon className="HeartIcon">
    <g>
      <path d="M10,7.4c0-1.8,1.5-3.2,3.3-3.2s3.3,1.4,3.3,3.2c0,4.5-6.5,8.4-6.5,8.4S3.5,12,3.5,7.4c0-1.8,1.5-3.2,3.3-3.2S10,5.6,10,7.4z" />
    </g>
  </SVGIcon>

export const ListIcon = () =>
  <SVGIcon className="ListIcon">
    <g>
      <path d="M6.2,8.8c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5h7.5c1.4,0,2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5H6.2z" />
      <path d="M6.2,16.2c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5h7.5c1.4,0,2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5H6.2z" />
    </g>
  </SVGIcon>

export const MarkerIcon = () =>
  <SVGIcon className="MarkerIcon">
    <path className="svg-fill" d="M10,2C6.7,2,4,4.7,4,8c0,3.7,4.3,9.4,5.6,11.1c0.2,0.3,0.6,0.3,0.8,0C11.7,17.4,16,11.8,16,8 C16,4.7,13.3,2,10,2z M10,9.9C9,9.9,8.1,9,8.1,8C8.1,7,9,6.1,10,6.1S11.9,7,11.9,8C11.9,9,11,9.9,10,9.9z" />
  </SVGIcon>

export const PencilIcon = () =>
  <SVGIcon className="PencilIcon">
    <g>
      <polygon points="12.6,4 16,7.3 7.4,15.9 4,15.9 4,12.5" />
    </g>
    <g>
      <line x1="10.2" y1="6.4" x2="13.6" y2="9.7" />
    </g>
  </SVGIcon>

export const PlusIconHeader = () =>
  <SVGIcon className="PlusIconMini">
    <g>
      <circle cx="10.5" cy="10.5" r="7" />
    </g>
    <g>
      <line x1="10.5" x2="10.5" y1="7.5" y2="13.5" />
      <line x1="13.5" x2="7.5" y1="10.5" y2="10.5" />
    </g>
  </SVGIcon>

export const PlusIconMini = () =>
  <SVGIcon className="PlusIconMini">
    <g>
      <line x1="10.5" x2="10.5" y1="6.5" y2="12.5" />
      <line x1="13.5" x2="7.5" y1="9.5" y2="9.5" />
    </g>
  </SVGIcon>

export const RelationshipIcon = () =>
  <SVGIcon className="RelationshipIcon">
    <g>
      <circle cx="7.5" cy="4.8" r="1.8" />
      <path d="M7.5 8.6c-1.9 0-3.5 1.6-3.5 3.5v2.9h7v-2.9M12.7 6.1v5M15.2 8.6h-5" />
    </g>
  </SVGIcon>

export const ReplyIcon = () =>
  <SVGIcon className="ReplyIcon">
    <g>
      <path d="M17,14.2c0-2.3-1.9-4.2-4.2-4.2H3" />
    </g>
    <g>
      <polyline points="7,14 3,10 7,6 " />
    </g>
  </SVGIcon>

export const RepostIcon = () =>
  <SVGIcon className="RepostIcon">
    <g className="svg-stroke-round">
      <path d="M15.2,6.7H5 c-0.5,0-1,0.4-1,1V10" />
      <path d="M4.8,14.4H15 c0.6,0,1-0.4,1-1v-2.3" />
    </g>
    <g className="svg-stroke-round">
      <polyline points="13.3,4 16,6.7 13.2,9.5" />
      <polyline points="6.7,17.1 4,14.4 6.8,11.7" />
    </g>
  </SVGIcon>

export const RequestIcon = () =>
  <SVGIcon className="RequestIcon">
    <g>
      <circle cx="12" cy="12" r="6" />
    </g>
  </SVGIcon>

export const SearchIcon = () =>
  <SVGIcon className="SearchIcon">
    <g className="svg-stroke-round">
      <circle cx="8.5" cy="8.5" r="5.5" />
    </g>
    <g className="svg-stroke-round">
      <path d="M12.5 12.5l4.5 4.5" />
    </g>
  </SVGIcon>

export const ShareIcon = () =>
  <SVGIcon className="ShareIcon">
    <g>
      <polyline points="7.8,7.3 5,7.3 5,17.3 15,17.3 15,7.3 12.2,7.3" />
    </g>
    <g>
      <line x1="10" y1="2" x2="10" y2="12" />
      <polyline className="svg-stroke-round" points="7.2,4.7 10,2 12.8,4.8" />
    </g>
  </SVGIcon>

export const SparklesIcon = () =>
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

export const SuccessIcon = () =>
  <SVGIcon className="SuccessIcon">
    <g>
      <polyline points="4.8,10.8 9.9,17 17.2,5" />
    </g>
  </SVGIcon>

export const XBoxIcon = () =>
  <SVGIcon className="XBoxIcon">
    <g>
      <rect x="3.5" y="3.5" width="12" height="12" />
    </g>
    <g>
      <line x1="12" y1="7" x2="7" y2="12" />
      <line x1="12" y1="12" x2="7" y2="7" />
    </g>
  </SVGIcon>

export const XIcon = () =>
  <SVGIcon className="CancelIcon">
    <g>
      <line x1="6" x2="14" y1="6" y2="14" />
      <line x1="14" x2="6" y1="6" y2="14" />
    </g>
  </SVGIcon>

export const XIconLG = () =>
  <SVGIcon className="ArrowIcon">
    <g>
      <line x1="17" y1="5" x2="5" y2="17" />
      <line x1="17" y1="17" x2="5" y2="5" />
    </g>
  </SVGIcon>

// -------------------------------------
// Social icons 60 x 60

export const FacebookIcon = () =>
  <SVGBox className="FacebookIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M31.3 38h-3.5v-8h-1.8v-2.8h1.8v-1.7c0-2.2 1-3.6 3.8-3.6h2.4v2.8h-1.5c-1.1 0-1.2.4-1.2 1.1v1.4h2.7l-.3 2.8h-2.4v8z" />
  </SVGBox>

export const GooglePlusIcon = () =>
  <SVGBox className="GooglePlusIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M38 25v-3h-1v3h-3v1h3v3h1v-3h3v-1zM32.2 21h-5s-4.8.1-4.8 4.4c0 4.3 4.7 3.8 4.7 3.8v1.1c0 .4.4.3.4 1.2-.3 0-6.4-.2-6.4 3.8 0 3.9 5.2 3.7 5.2 3.7s6 .3 6-4.6c0-2.9-3.4-3.8-3.4-5 0-1.2 2.6-1.5 2.6-4.3 0-1.7-.2-2.6-1.5-3.2-.1-.4 2.2-.1 2.2-.9zm-1.6 13.8c.1 1.5-1.5 2.9-3.6 3-2.1.1-3.8-1-3.9-2.5-.1-1.5 1.5-2.9 3.6-3 2-.2 3.8.9 3.9 2.5zm-3.1-6.6c-1.2.3-2.6-.8-3.1-2.5s.1-3.4 1.4-3.7c1.2-.3 2.6.8 3.1 2.5s-.2 3.4-1.4 3.7z" />
  </SVGBox>

export const LinkedInIcon = () =>
  <SVGBox className="LinkedInIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M25.9 38v-10.8h-3.6v10.8h3.6zm-1.9-12.3c1.3 0 2.1-.8 2.1-1.9 0-1.1-.8-1.9-2-1.9s-2.1.8-2.1 1.9c0 1.1.8 1.9 2 1.9zM27.9 38h3.6v-6c0-.3 0-.6.1-.9.3-.6.9-1.3 1.9-1.3 1.3 0 1.8 1 1.8 2.4v5.8h3.7v-6.2c0-3.3-1.8-4.9-4.2-4.9-2 0-2.8 1.1-3.3 1.8v-1.6h-3.6v10.9z" />
  </SVGBox>

export const MailIcon = () =>
  <SVGBox className="MailIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <polygon className="SVGBoxFG" points="20.724,25.067 20.724,34.632 26.574,29.605" />
    <polygon className="SVGBoxFG" points="33.426,29.605 39.277,34.632 39.277,25.066" />
    <path className="SVGBoxFG" d="M29.617,31.964l-2.034-1.578l-5.173,4.444h15.18l-5.173-4.444l-2.034,1.578 C30.158,32.139,29.842,32.139,29.617,31.964z" />
    <polygon className="SVGBoxFG" points="30,30.68 38.451,24.125 21.549,24.125" />
  </SVGBox>

export const PinterestIcon = () =>
  <SVGBox className="PinterestIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M30 21c-5 0-9 4-9 9 0 3.7 2.2 6.8 5.4 8.2 0-.6 0-1.4.2-2.1.2-.7 1.2-4.9 1.2-4.9s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.4 0 .8-.5 2.1-.8 3.2-.2 1 .5 1.7 1.4 1.7 1.7 0 2.9-2.2 2.9-4.8 0-2-1.3-3.4-3.7-3.4-2.7 0-4.4 2-4.4 4.3 0 .8.2 1.3.6 1.8.2.2.2.3.1.5 0 .2-.1.6-.2.7-.1.2-.2.3-.5.2-1.3-.5-1.8-1.9-1.8-3.4 0-2.6 2.2-5.6 6.4-5.6 3.4 0 5.7 2.5 5.7 5.2 0 3.5-2 6.2-4.9 6.2-1 0-1.9-.5-2.2-1.1 0 0-.5 2.1-.6 2.5-.2.7-.6 1.4-.9 1.9.8.2 1.7.4 2.5.4 5 0 9-4 9-9 0-5.2-4-9.2-9-9.2z" />
  </SVGBox>

export const RedditIcon = () =>
  <SVGBox className="RedditIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M38.1 22c0 .9.7 1.6 1.6 1.6.9 0 1.6-.7 1.6-1.6 0-.9-.7-1.6-1.6-1.6-.8 0-1.6.7-1.6 1.6zm-.1-.9l-5.4-1.1c-.2 0-.5.1-.5.3l-2.1 5.7h1l1.8-5.1 5 1 .2-.8zm-18.9 11.4c.4-1.5 1.5-2.9 3-4-.4-.4-1-.6-1.6-.6-1.4 0-2.5 1.1-2.5 2.5 0 .8.4 1.6 1.1 2.1zm22.5 1.3c0-3.9-4.9-7-10.9-7s-10.9 3.1-10.9 7 4.9 7 10.9 7 10.9-3.1 10.9-7zm1.9-3.4c0-1.4-1.1-2.5-2.5-2.5-.6 0-1.2.3-1.7.7 1.5 1.1 2.6 2.5 3 4 .7-.5 1.2-1.3 1.2-2.2z" />
    <circle className="SVGBoxBG" cx="34.7" cy="32.4" r="1.7" />
    <circle className="SVGBoxBG" cx="26.7" cy="32.4" r="1.7" />
    <path className="SVGBoxBG" d="M34.4 36.9c-.7.7-1.9 1.1-3.6 1.1-1.7 0-2.9-.3-3.6-1.1-.2-.2-.4-.2-.6 0s-.2.4 0 .6c.9.9 2.2 1.3 4.2 1.3 1.9 0 3.3-.4 4.2-1.3.2-.2.2-.4 0-.6-.2-.1-.5-.1-.6 0z" />
  </SVGBox>

export const TumblrIcon = () =>
  <SVGBox className="TumblrIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M30.6 22v4h3.9v2.5h-3.9v4.1c0 .9 0 1.5.1 1.8.1.3.3.5.6.6.4.2.8.3 1.2.3.8 0 1.6-.3 2.5-.8v2.5c-.7.3-1.3.5-1.9.7-.6.1-1.2.2-1.8.2-.7 0-1.4-.1-2-.3-.6-.2-1.1-.4-1.5-.8-.4-.3-.7-.7-.8-1.1-.2-.4-.2-.9-.2-1.7v-5.6h-1.8v-2.3c.6-.2 1.2-.5 1.6-.9.5-.4.8-.8 1.1-1.4.3-.5.5-1.2.6-2h2.3z" />
  </SVGBox>

export const TwitterIcon = () =>
  <SVGBox className="TwitterIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M40 23.9c-.7.3-1.5.5-2.4.6.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-3-1.3-2.3 0-4.1 1.8-4.1 4 0 .3 0 .6.1.9-3.4-.2-6.4-1.8-8.5-4.2-.4.6-.6 1.3-.6 2 0 1.4.7 2.6 1.8 3.4-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.7-5.1 1.7-.3 0-.7 0-1-.1 1.8 1.1 4 1.8 6.3 1.8 7.8.1 12-6.1 12-11.4v-.5c.8-.6 1.5-1.3 2-2.1z" />
  </SVGBox>

