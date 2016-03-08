import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import trunc from 'trunc-html'

function getTextContent(blocks) {
  let text = ''
  for (const block of blocks) {
    if (block.kind === 'text') {
      text += block.data
    }
  }
  return text.length ? trunc(text, 200).text : ''
}

function getTitle(text, username) {
  const paragraphs = text.split('\n')
  const title = paragraphs[0].split('.')[0]
  return (
    title.length ?
    `${title} - from @${username} on Ello.` :
    `A post from @${username} on Ello.`
  )
}

function getDescription(text) {
  return text.length ? text : 'Discover more amazing work like this on Ello.'
}

function getImages(blocks) {
  const imageUrls = []
  for (const block of blocks) {
    if (block.kind === 'image' && block.data && block.data.url) {
      imageUrls.push(block.data.url)
    }
  }
  return imageUrls
}

function getEmbeds(blocks) {
  const embedUrls = []
  for (const block of blocks) {
    if (block.kind === 'embed' && block.data && block.data.thumbnailLargeUrl) {
      embedUrls.push(block.data.thumbnailLargeUrl)
    }
  }
  return embedUrls
}

function getMetaTags({ badForSeo, title, desc, url }) {
  const robots = badForSeo ? 'noindex, follow' : 'index, follow'
  const tags = [
    { name: 'robots', content: robots },
    { name: 'name', itemprop: 'name', content: title },
    { name: 'url', itemprop: 'url', content: url },
    { name: 'description', itemprop: 'description', content: desc },
  ]
  return tags
}

function getOpenGraphTags({ title, desc, images, embeds, url }) {
  const tags = [
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: url },
    { property: 'og:title', content: title },
    { property: 'og:description', content: desc },
  ]
  const imgs = [].concat(images, embeds)
  for (const img of imgs) {
    tags.push({ property: 'og:image', content: img })
  }
  return tags
}

// Twitter wants images under 1mb, so we may need to look up the assets
// eventually. For now, only flip the card if we don't have any images.
function getTwitterTags({ images = [], embeds = [] }) {
  const tags = []
  if (!images.length && !embeds.length) {
    tags.push({ name: 'twitter:card', content: 'summary' })
  }
  return tags
}

function getSchemaTags({ images, embeds }) {
  const tags = []
  const imgs = [].concat(images, embeds)
  for (const img of imgs) {
    tags.push({ name: 'image', itemprop: 'image', content: img })
  }
  return tags
}

export const PostDetailHelmet = ({ post, author }) => {
  const blocks = (post.repostContent || post.content) || post.summary
  const text = getTextContent(blocks)
  const title = getTitle(text, author.username)
  const desc = getDescription(text)
  const images = getImages(blocks)
  const embeds = getEmbeds(blocks)
  const url = `${ENV.AUTH_DOMAIN}/${author.username}/post/${post.token}`
  const repostUrl = post.repostContent ? `${ENV.AUTH_DOMAIN}${post.repostPath}` : null

  const metaTags = getMetaTags({ badForSeo: author.badForSeo, title, desc, url })
  const openGraphTags = getOpenGraphTags({ title, desc, images, embeds, url })
  const twitterTags = getTwitterTags({ images, embeds })
  const schemaTags = getSchemaTags({ images, embeds })
  const tags = [].concat(metaTags, openGraphTags, twitterTags, schemaTags)
  const links = post.repostContent ? [{ rel: 'canonical', href: repostUrl }] : []

  return <Helmet title={ title } link={ links } meta={ tags } />
}

PostDetailHelmet.propTypes = {
  author: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
}

