// @flow
import React from 'react'
import { css } from 'glamor'
import {
  ElloBoxMark,
  ElloDonutMark,
  ElloMark,
  ElloRainbowMark,
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

export default() =>
  <section {...sectionStyle}>
    <h2 {...h2Style}>Ello icons</h2>
    <div {...groupStyle} >
      <ElloBoxMark />
      <ElloMark />
      <ElloRainbowMark />
      <ElloDonutMark />
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

