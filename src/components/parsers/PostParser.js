import React from 'react'
import { Link } from 'react-router'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { getLinkObject } from '../base/json_helper'
import Avatar from '../assets/Avatar'
import TextRegion from '../posts/regions/TextRegion'
import ImageRegion from '../posts/regions/ImageRegion'
import PostTools from '../posts/PostTools'
import { RepostIcon } from '../posts/PostIcons'
import RelationsGroup from '../relationships/RelationsGroup'

let models = {}

function getPostDetailPath(author, post) {
  return `/${author.username}/post/${post.token}`
}

function header(post, author) {
  if (!post || !author) { return null }
  return (
    <header className="PostHeader" key={`PostHeader_${post.id}`}>
      <div className="PostHeaderAuthor">
        <Link className="PostHeaderLink" to={`/${author.username}`}>
          <Avatar sources={author.avatar} />
          <span>{`@${author.username}`}</span>
        </Link>
      </div>
      <RelationsGroup user={author} />
    </header>
  )
}

function repostHeader(post, repostAuthor, repostSource, repostedBy) {
  if (!post || !repostedBy) { return null }
  return (
    <header className="RepostHeader" key={`RepostHeader_${post.id}`}>
      <div className="RepostHeaderAuthor">
        <Link className="PostHeaderLink" to={`/${repostAuthor.username}`}>
          <Avatar sources={repostAuthor.avatar} />
          <span>{`@${repostAuthor.username}`}</span>
        </Link>
      </div>
      <div className="RepostHeaderReposter">
        <Link className="PostHeaderLink" to={`/${repostedBy.username}`}>
          <RepostIcon />
          {` by @${repostedBy.username}`}
        </Link>
      </div>
      <RelationsGroup user={repostAuthor} />
    </header>
  )
}

function textRegion(region, key, isGridLayout, postDetailPath) {
  return (
    <TextRegion
      content={region.data}
      isGridLayout={isGridLayout}
      key={key}
      postDetailPath={postDetailPath}
    />
  )
}

function imageRegion(region, key, isGridLayout, postDetailPath) {
  return (
    <ImageRegion
      assets={models.assets}
      content={region.data}
      isGridLayout={isGridLayout}
      key={key}
      links={region.links}
      postDetailPath={postDetailPath}
    />
  )
}

function embedRegion(region, key) {
  const data = {}
  data[`data-${region.data.service}-id`] = region.data.id
  return (
    <div className="EmbedRegion embetter" {...data} key={key}>
      <Link className="RegionContent" to={region.data.url}>
        <img src={region.data.thumbnailLargeUrl} />
      </Link>
    </div>
  )
}

function regionItems(content, only = null, isGridLayout = true, postDetailPath = null) {
  return content.map((region, i) => {
    if (!only || only === region.kind) {
      switch (region.kind) {
        case 'text':
          return textRegion(region, `TextRegion_${i}`, isGridLayout, postDetailPath)
        case 'image':
          return imageRegion(region, `ImageRegion_${i}`, isGridLayout, postDetailPath)
        case 'embed':
          return embedRegion(region, `EmbedRegion_${i}`)
        default:
          throw new Error(`UNKNOWN REGION: ${region.kind}`)
      }
    }
  })
}

function body(content, id, isGridLayout, postDetailPath = null) {
  return (
    <div className="PostBody" key={`PostBody_${id}`}>
      {regionItems(content, null, isGridLayout, postDetailPath)}
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
      cells.push(body(post.repostContent, `repost_${post.id}`, isGridLayout))
      if (post.content && post.content.length) {
        cells.push(body(post.content, post.id, isGridLayout))
      }
    }
  } else {
    cells.push(header(post, author))
    const content = isGridLayout ? post.summary : post.content
    cells.push(body(content, post.id, isGridLayout, getPostDetailPath(author, post)))
  }
  cells.push(footer(post, author, currentUser))
  models = {}
  return cells
}

export function parseSummary(post, json, only = null) {
  models = json
  return regionItems(post.summary, only, false)
}

