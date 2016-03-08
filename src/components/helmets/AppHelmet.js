import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'

const title = `Ello | Be inspired.`
const image = `/apple-touch-icon-precomposed.png`

const description =
  `Ello is a place to discover beautiful art, be inspired by meaningful
  stories, and connect with creators around the world.`

const keywords =
  `Ello, Ello.co, Social Network, Ad-free, No ads, no advertising, message
  service, data mining, free, instant message, message, messaging, private
  messaging, text messaging, text post, image post, sound file, video, words,
  friends, noise, friends and noise, Youtube, Vimeo, Facebook, Tumblr, Twitter,
  Instagram, App.net, Pinterest, Path`

const viewport = `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`

export const AppHelmet = ({ pathname }) =>
  <Helmet
    title={ title }
    link={[
      { rel: 'apple-touch-icon', href: image },
      { rel: 'apple-touch-icon-precomposed', href: image },
      { rel: 'mask-icon', href: 'ello-icon.svg', color: 'black' },
    ]}
    meta={[
      { name: 'name', itemprop: 'name', content: title },
      { name: 'url', itemprop: 'url', content: `${ENV.AUTH_DOMAIN}${pathname}` },
      { name: 'description', itemprop: 'description', content: description },
      { name: 'image', itemprop: 'image', content: image },
      { name: 'author', itemprop: 'author', content: 'Ello PBC USA' },
      { name: 'copyright', itemprop: 'copyrightHolder', content: 'Ello PBC USA' },
      { name: 'keywords', content: keywords },
      { name: 'referrer', content: 'always' },
      { name: 'revisit-after', content: '1 day' },
      { name: 'viewport', content: viewport },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'white-translucent' },
      { name: 'apple-itunes-app', content: 'app-id=953614327', 'app-argument': pathname },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Ello' },
      { property: 'og:url', content: `${ENV.AUTH_DOMAIN}${pathname}` },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { name: 'twitter:site', content: '@elloworld' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ]}
  />

AppHelmet.propTypes = {
  pathname: PropTypes.string.isRequired,
}

