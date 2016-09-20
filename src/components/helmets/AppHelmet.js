import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import { META } from '../../constants/application_types'

const title = META.TITLE
const image = '/apple-touch-icon-precomposed.png'

const description =
  `Welcome to the Creators Network. Ello is a community to discover,
  discuss, publish, share and promote the things you are passionate about.`

function getPaginationLinks(pagination, pathname) {
  const links = []
  if (!pagination || !pagination.next) { return links }
  links.push({ href: `${pathname}?${pagination.next.split('?')[1]}`, rel: 'next' })
  return links
}

export const AppHelmet = ({ pagination, pathname }) =>
  <Helmet
    title={title}
    link={[
      { href: image, rel: 'apple-touch-icon' },
      { href: image, rel: 'apple-touch-icon-precomposed' },
      { href: 'ello-icon.svg', rel: 'mask-icon', color: 'black' },
      ...getPaginationLinks(pagination, pathname),
    ]}
    meta={[
      { name: 'apple-itunes-app', content: 'app-id=953614327', 'app-argument': pathname },
      { name: 'name', itemprop: 'name', content: title },
      { name: 'url', itemprop: 'url', content: `${ENV.AUTH_DOMAIN}${pathname}` },
      { name: 'description', itemprop: 'description', content: description },
      { name: 'image', itemprop: 'image', content: image },
      { property: 'og:url', content: `${ENV.AUTH_DOMAIN}${pathname}` },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
    ]}
  />

AppHelmet.propTypes = {
  pagination: PropTypes.object,
  pathname: PropTypes.string.isRequired,
}

export default AppHelmet

