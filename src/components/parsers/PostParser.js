import React from 'react'
import { Link } from 'react-router'
import Avatar from '../users/Avatar'
import ImageRegion from '../posts/regions/ImageRegion'
import PostTools from '../posts/PostTools'
import { RepostIcon } from '../iconography/Icons'
import { getLinkObject } from '../base/json_helper'
import * as MAPPING_TYPES from '../../constants/mapping_types'


let models = {}

function header(post, author) {
  if (!post || !author) { return null }
  return (
    <header className="PostHeader" key={`postHeader_${post.id}`}>
      <Link to={`/${author.username}`}>
        <Avatar imgSrc={author.avatar.regular.url} />
      </Link>
      <div className="vitals">
        <Link to={`/${author.username}`}>{`@${author.username}`}</Link>
      </div>
    </header>
  )
}

function repostHeader(post, repostAuthor, repostSource, repostedBy) {
  if (!post || !repostedBy) { return null }
  return (
    <header className="RepostHeader" key={`postHeader_${post.id}`}>
      <Link to={`/${repostAuthor.username}`}>
        <Avatar imgSrc={repostAuthor.avatar.regular.url} />
      </Link>
      <div className="vitals">
        <div>
          <Link to={`/${repostAuthor.username}`}>{`@${repostAuthor.username}`}</Link>
        </div>
        <div>
          <Link className="reposted-by" to={`/${repostedBy.username}`}>
            <RepostIcon />
            {` by ${repostedBy.username}`}
          </Link>
        </div>
      </div>
    </header>
  )
}

function textRegion(region, key) {
  return (
    <div key={key}
      className="Region TextRegion"
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

function regionItems(content, only = null) {
  return content.map((region, i) => {
    if (!only || only === region.kind) {
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
    }
  })
}

function body(content) {
  return (
    <div className="PostBody">
      {regionItems(content)}
    </div>
  )
}


function footer(post, author, currentUser) {
  if (!author) { return null }
  return <PostTools author={author} post={post} currentUser={currentUser} key={`postTools_${post.id}`} />
}

export function parsePost(post, json, currentUser, gridLayout = true) {
  if (!post) { return null }
  models = json
  const author = json[MAPPING_TYPES.USERS][post.authorId]
  const cells = []
  if (post.repostContent && post.repostContent.length) {
    cells.push(repostHeader(post, getLinkObject(post, 'repostAuthor', json), getLinkObject(post, 'repostedSource', json), author))
    // this is weird, but the post summary is
    // actually the repost summary on reposts
    if (gridLayout) {
      cells.push(body(post.summary))
    } else {
      cells.push(regionItems(post.repostContent))
      if (post.content && post.content.length) {
        cells.push(body(post.content))
      }
    }
  } else {
    cells.push(header(post, author))
    const content = gridLayout ? post.summary : post.content
    cells.push(body(content))
  }
  cells.push(footer(post, author, currentUser))
  models = {}
  return cells
}

export function parseSummary(post, json, only = null) {
  models = json
  return regionItems(post.summary, only)
}

