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
  CheckIcon,
  ChevronIcon,
  GridIcon,
  ListIcon,
  MarkerIcon,
  PhoneIcon,
  ShareIcon,
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

const h2Style = css({
  marginBottom: 10,
  fontSize: 16,
})

const sectionStyle = {
  ...flex,
  ...flexColumn,
  ...flexWrap,
  ...wrapperPaddingX,
  ...css({
    marginTop: 40,
  }),
}

const groupStyle = {
  ...flex,
  ...css({
    marginBottom: 40,
    '> *': {
      marginRight: 10,
    },
  }),
}

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
    <h2 {...h2Style}>Icons</h2>
    <div {...groupStyle} >
      <span {...badgeStyle} >
        <BadgeCheckIcon />
      </span>
      <ShareIcon />
      <XIcon />
      <CheckIcon />
      <ArrowEastIcon />
      <PhoneIcon />
      <ChevronIcon />
      <ListIcon />
      <GridIcon />
      <MarkerIcon />
    </div>
    <h2 {...h2Style}>Social icons</h2>
    <div {...groupStyle} >
      <MailIcon />
      <FacebookIcon />
      <TwitterIcon />
      <PinterestIcon />
      <GooglePlusIcon />
      <TumblrIcon />
      <RedditIcon />
      <LinkedInIcon />
    </div>
  </section>

