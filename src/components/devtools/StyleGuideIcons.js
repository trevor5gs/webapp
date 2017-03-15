// @flow
import React from 'react'
import { css } from 'glamor'
import {
  // Ello icons
  ElloMark,
  ElloBoxMark,
  ElloDonutMark,
  ElloRainbowMark,
  // Badge icons
  BadgeCheckIcon,
  // Icons
  ArrowEastIcon,
  BoltIcon,
  BubbleIcon,
  CheckIcon,
  CheckIconHeader,
  CheckIconMini,
  ChevronIcon,
  DotsIcon,
  EyeIcon,
  FailureIcon,
  FlagIcon,
  GridIcon,
  HeartIcon,
  ListIcon,
  MarkerIcon,
  PencilIcon,
  PlusIconHeader,
  PlusIconMini,
  ReplyIcon,
  RepostIcon,
  RequestIcon,
  ShareIcon,
  SuccessIcon,
  XBoxIcon,
  XIcon,
  // Social icons
  FacebookIcon,
  GooglePlusIcon,
  LinkedInIcon,
  MailIcon,
  PinterestIcon,
  RedditIcon,
  TumblrIcon,
  TwitterIcon,
} from '../assets/Icons'
import {
  flex,
  flexColumn,
  flexWrap,
  wrapperPaddingX,
} from '../../styles/cso'

const sectionStyle = {
  ...flex,
  ...flexColumn,
  ...flexWrap,
  ...wrapperPaddingX,
  ...css({
    marginTop: 40,
    marginBottom: 40,
  }),
}

const h2Style = css({
  marginBottom: 10,
  fontSize: 16,
})

const groupStyle = {
  ...flex,
  ...css({
    marginBottom: 40,
    '> *': {
      marginRight: 10,
    },
  }),
}

// Fix this
const badgeStyle = css({
  '& .CheckShape': {
    stroke: 'white',
  },
})

export default() =>
  <section {...sectionStyle}>
    <h2 {...h2Style}>Ello icons</h2>
    <div {...groupStyle} >
      <ElloBoxMark />
      <ElloMark />
      <ElloRainbowMark />
      <ElloDonutMark />
    </div>
    <h2 {...h2Style}>Badge icons</h2>
    <div {...groupStyle} >
      <button {...badgeStyle} title="BadgeCheckIcon">
        <BadgeCheckIcon />
      </button>
    </div>
    <h2 {...h2Style}>Icons</h2>
    <div {...groupStyle} >
      <button title="ArrowEastIcon">
        <ArrowEastIcon />
      </button>
      <button title="BoltIcon">
        <BoltIcon />
      </button>
      <button title="BubbleIcon">
        <BubbleIcon />
      </button>
      <button title="CheckIcon">
        <CheckIcon />
      </button>
      <button title="CheckIconHeader">
        <CheckIconHeader />
      </button>
      <button title="CheckIconMini">
        <CheckIconMini />
      </button>
      <button title="ChevronIcon">
        <ChevronIcon />
      </button>
      <button title="DotsIcon">
        <DotsIcon />
      </button>
      <button title="EyeIcon">
        <EyeIcon />
      </button>
      <button title="FailureIcon">
        <FailureIcon />
      </button>
      <button title="FlagIcon">
        <FlagIcon />
      </button>
      <button title="GridIcon">
        <GridIcon />
      </button>
      <button title="HeartIcon">
        <HeartIcon />
      </button>
      <button title="ListIcon">
        <ListIcon />
      </button>
      <button title="MarkerIcon">
        <MarkerIcon />
      </button>
      <button title="PencilIcon">
        <PencilIcon />
      </button>
      <button title="PlusIconHeader">
        <PlusIconHeader />
      </button>
      <button title="PlusIconMini">
        <PlusIconMini />
      </button>
      <button title="ReplyIcon">
        <ReplyIcon />
      </button>
      <button title="RepostIcon">
        <RepostIcon />
      </button>
      <button title="RequestIcon">
        <RequestIcon />
      </button>
      <button title="ShareIcon">
        <ShareIcon />
      </button>
      <button title="SuccessIcon">
        <SuccessIcon />
      </button>
      <button title="XBoxIcon">
        <XBoxIcon />
      </button>
      <button title="XIcon">
        <XIcon />
      </button>
    </div>
    <h2 {...h2Style}>Social icons</h2>
    <div {...groupStyle} >
      <button title="MailIcon">
        <MailIcon />
      </button>
      <button title="FacebookIcon">
        <FacebookIcon />
      </button>
      <button title="TwitterIcon">
        <TwitterIcon />
      </button>
      <button title="PinterestIcon">
        <PinterestIcon />
      </button>
      <button title="GooglePlusIcon">
        <GooglePlusIcon />
      </button>
      <button title="TumblrIcon">
        <TumblrIcon />
      </button>
      <button title="RedditIcon">
        <RedditIcon />
      </button>
      <button title="LinkedInIcon">
        <LinkedInIcon />
      </button>
    </div>
  </section>

