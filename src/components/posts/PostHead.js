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

function getSchemaTags({ title, desc, images, embeds, url }) {
  const tags = [
    { itemprop: 'url', content: url },
    { itemprop: 'name', content: title },
    { itemprop: 'description', content: desc },
  ]
  const imgs = [].concat(images, embeds)
  for (const img of imgs) {
    tags.push({ itemprop: 'image', content: img })
  }
  return tags
}

export const PostHead = ({ post, author }) => {
  const blocks = (post.repostContent || post.content) || post.summary
  const text = getTextContent(blocks)
  const title = getTitle(text, author.username)
  const desc = getDescription(text)
  const images = getImages(blocks)
  const embeds = getEmbeds(blocks)
  const url = `${ENV.AUTH_DOMAIN}/${author.username}/post/${post.token}`

  const openGraphTags = getOpenGraphTags({ title, desc, images, embeds, url })
  const twitterTags = getTwitterTags({ images, embeds })
  const schemaTags = getSchemaTags({ title, desc, images, embeds, url })
  const tags = [].concat(openGraphTags, twitterTags, schemaTags)
  return <Helmet title={ title } meta={ tags } />
}

PostHead.propTypes = {
  assets: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
}

