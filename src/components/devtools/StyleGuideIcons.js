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
  RelationshipIcon,
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
  combine,
  flex,
  flexColumn,
  flexWrap,
  wrapperPaddingX,
} from '../../styles/cso'

const sectionStyle = combine(
  flex,
  flexColumn,
  flexWrap,
  wrapperPaddingX,
  css({
    marginTop: 40,
    marginBottom: 40,
  }),
)

const h2Style = css({
  marginBottom: 10,
  fontSize: 16,
})

const groupStyle = combine(
  flex,
  css({
    marginBottom: 40,
    '> *': {
      marginRight: 10,
    },
  }),
)

// TODO: Fix this
const badgeStyle = css({
  '& .CheckShape': {
    stroke: 'white',
  },
})

export default() =>
  <section className={sectionStyle}>
    <h2 className={h2Style}>Ello icons</h2>
    <div className={groupStyle}>
      <ElloBoxMark />
      <ElloMark />
      <ElloRainbowMark />
      <ElloDonutMark />
    </div>
    <h2 className={h2Style}>Badge icons</h2>
    <div className={groupStyle}>
      <button className={badgeStyle} title="BadgeCheckIcon">
        <BadgeCheckIcon />
      </button>
    </div>
    <h2 className={h2Style}>Icons</h2>
    <div className={groupStyle}>
      { [
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
        RelationshipIcon,
        ReplyIcon,
        RepostIcon,
        RequestIcon,
        ShareIcon,
        SuccessIcon,
        XBoxIcon,
        XIcon,
      ].map(icon => <button key={icon.name} title={icon.name}>{icon()}</button>) }
    </div>
    <h2 className={h2Style}>Social icons</h2>
    <div className={groupStyle} >
      { [
        FacebookIcon,
        GooglePlusIcon,
        LinkedInIcon,
        MailIcon,
        PinterestIcon,
        RedditIcon,
        TumblrIcon,
        TwitterIcon,
      ].map(icon => <button key={icon.name} title={icon.name}>{icon()}</button>) }
    </div>
  </section>

