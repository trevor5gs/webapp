import React from 'react'
import { Link } from 'react-router'
import Avatar from '../users/Avatar'
import ImageRegion from '../posts/regions/ImageRegion'
import PostTools from '../posts/PostTools'
import { RepostIcon } from '../posts/PostIcons'
import { getLinkObject } from '../base/json_helper'
import * as MAPPING_TYPES from '../../constants/mapping_types'


let models = {}

function header(post, author) {
  if (!post || !author) { return null }
  return (
    <header className="PostHeader" key={`PostHeader_${post.id}`}>
      <Link to={`/${author.username}`}>
        <Avatar imgSrc={author.avatar.regular.url} />
      </Link>
      <div className="Vitals">
        <Link to={`/${author.username}`}>{`@${author.username}`}</Link>
      </div>
    </header>
  )
}

function repostHeader(post, repostAuthor, repostSource, repostedBy) {
  if (!post || !repostedBy) { return null }
  return (
    <header className="RepostHeader" key={`PostHeader_${post.id}`}>
      <Link to={`/${repostAuthor.username}`}>
        <Avatar imgSrc={repostAuthor.avatar.regular.url} />
      </Link>
      <div className="Vitals">
        <div className="RepostAuthor">
          <Link to={`/${repostAuthor.username}`}>{`@${repostAuthor.username}`}</Link>
        </div>
        <div className="RepostReposter">
          <Link to={`/${repostedBy.username}`}>
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
      className="TextRegion"
      dangerouslySetInnerHTML={{__html: region.data}} />
  )
}

function imageRegion(region, key, isGridLayout) {
  return (
    <ImageRegion key={key}
      assets={models.assets}
      content={region.data}
      isGridLayout={isGridLayout}
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

function regionItems(content, only = null, isGridLayout) {
  return content.map((region, i) => {
    if (!only || only === region.kind) {
      switch (region.kind) {
      case 'text':
        return textRegion(region, `TextRegion_${i}`)
      case 'image':
        return imageRegion(region, `ImageRegion_${i}`, isGridLayout)
      case 'embed':
        return embedRegion(region, `EmbedRegion_${i}`)
      default:
        throw new Error(`UNKNOWN REGION: ${region.kind}`)
      }
    }
  })
}

function body(content, id, isGridLayout) {
  return (
    <div className="PostBody" key={`PostBody_${id}`}>
      {regionItems(content, null, isGridLayout)}
    </div>
  )
}


function footer(post, author, currentUser) {
  if (!author) { return null }
  return <PostTools author={author} post={post} currentUser={currentUser} key={`PostTools_${post.id}`} />
}

export function parsePost(post, json, currentUser, isGridLayout = true) {
  if (!post) { return null }
  models = json
  const author = json[MAPPING_TYPES.USERS][post.authorId]
  const cells = []
  if (post.repostContent && post.repostContent.length) {
    cells.push(repostHeader(post, getLinkObject(post, 'repostAuthor', json), getLinkObject(post, 'repostedSource', json), author))
    // this is weird, but the post summary is
    // actually the repost summary on reposts
    if (isGridLayout) {
      cells.push(body(post.summary, post.id, isGridLayout))
    } else {
      cells.push(body(post.repostContent, post.id, isGridLayout))
      if (post.content && post.content.length) {
        cells.push(body(post.content, post.id, isGridLayout))
      }
    }
  } else {
    cells.push(header(post, author))
    const content = isGridLayout ? post.summary : post.content
    cells.push(body(content, post.id, isGridLayout))
  }
  cells.push(footer(post, author, currentUser))
  models = {}
  return cells
}

export function parseSummary(post, json, only = null) {
  models = json
  return regionItems(post.summary, only, false)
}

