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
  CheckIconHeader,
  CheckIconMini,
  ChevronIcon,
  DotsIcon,
  GridIcon,
  ListIcon,
  MarkerIcon,
  PlusIconHeader,
  PlusIconMini,
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
    <h2 {...h2Style}>Badge icons</h2>
    <div {...groupStyle} >
      <button {...badgeStyle} >
        <BadgeCheckIcon />
      </button>
    </div>
    <h2 {...h2Style}>Icons</h2>
    <div {...groupStyle} >
      <button>
        <ArrowEastIcon />
      </button>
      <button>
        <CheckIcon />
      </button>
      <button>
        <CheckIconHeader />
      </button>
      <button>
        <CheckIconMini />
      </button>
      <button>
        <ChevronIcon />
      </button>
      <button>
        <DotsIcon />
      </button>
      <button>
        <GridIcon />
      </button>
      <button>
        <ListIcon />
      </button>
      <button>
        <MarkerIcon />
      </button>
      <button>
        <PlusIconHeader />
      </button>
      <button>
        <PlusIconMini />
      </button>
      <button>
        <ShareIcon />
      </button>
      <button>
        <XIcon />
      </button>
    </div>
    <h2 {...h2Style}>Social icons</h2>
    <div {...groupStyle} >
      <button>
        <MailIcon />
      </button>
      <button>
        <FacebookIcon />
      </button>
      <button>
        <TwitterIcon />
      </button>
      <button>
        <PinterestIcon />
      </button>
      <button>
        <GooglePlusIcon />
      </button>
      <button>
        <TumblrIcon />
      </button>
      <button>
        <RedditIcon />
      </button>
      <button>
        <LinkedInIcon />
      </button>
    </div>
  </section>

