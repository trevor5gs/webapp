import React from 'react'
import Avatar from '../users/Avatar'
import ImageRegion from './regions/ImageRegion'
import PostTools from './PostTools'
import { RepostIcon } from '../iconography/Icons'


let models = {}

function header(post, author) {
  return (
    <header className="PostHeader" key={`postHeader_${post.id}`}>
      <Avatar imgSrc={author.avatar.regular.url} />
      <div className="vitals">
        <a className="username" name="username" href={`/${author.username}`}>{`@${author.username}`}</a>
      </div>
    </header>
  )
}

function repostHeader(post, repostAuthor, repostSource, repostedBy) {
  return (
    <header className="RepostHeader" key={`postHeader_${post.id}`}>
      <div className="vitals">
        <a className="reposted-by" href={`/${repostedBy.username}`}>
          <RepostIcon />
          {` by ${repostedBy.username}`}
        </a>
      </div>
    </header>
  )
}

function textRegion(region, key) {
  return (
    <div key={key}
      className="TextRegion"
      dangerouslySetInnerHTML={{__html: region.data}} />
  )
}

function imageRegion(region, key) {
  return (
    <ImageRegion key={key}
      assets={models.assets}
      content={region.data}
      links={region.links} />
  )
}

function embedRegion(region, key) {
  const data = {}
  data[`data-${region.data.service}-id`] = region.data.id
  return (
    <div className="embetter" {...data} key={key}>
      <a href={region.data.url}>
        <img src={region.data.thumbnailLargeUrl} />
      </a>
    </div>
  )
}

function regionItems(content) {
  return content.map((region, i) => {
    switch (region.kind) {
    case 'text':
      return textRegion(region, `textRegion_${i}`)
    case 'image':
      return imageRegion(region, `imageRegion_${i}`)
    case 'embed':
      return embedRegion(region, `embedRegion_${i}`)
    default:
      throw new Error(`UNKNOWN REGION: ${region.kind}`)
    }
  })
}

function footer(post, author, currentUser) {
  return <PostTools author={author} post={post} currentUser={currentUser} key={`postTools_${post.id}`} />
}

export function parsePost(post, json, currentUser, gridLayout = true) {
  models = json
  const author = json.users[post.authorId]
  const cells = []
  if (post.repostContent && post.repostContent.length) {
    // TODO: pass repostAuthor and repostSource to this
    cells.push(repostHeader(post, null, null, author))
    // this is weird, but the post summary is
    // actually the repost summary on reposts
    if (gridLayout) {
      cells.push(regionItems(post.summary))
    } else {
      cells.push(regionItems(post.repostContent))
      if (post.content && post.content.length) {
        cells.push(regionItems(post.content))
      }
    }
  } else {
    cells.push(header(post, author))
    const content = gridLayout ? post.summary : post.content
    cells.push(regionItems(content))
  }
  cells.push(footer(post, author, currentUser))
  models = {}
  return cells
}

