import React from 'react'
import { Link } from 'react-router'
import Avatar from '../assets/Avatar'
import TextRegion from '../posts/regions/TextRegion'
import ImageRegion from '../posts/regions/ImageRegion'

let models = {}

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

export function regionItems(content, only = null, isGridLayout = true, postDetailPath = null) {
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

export function body(content, id, isGridLayout, postDetailPath = null) {
  return (
    <div className="PostBody" key={`PostBody_${id}`}>
      {regionItems(content, null, isGridLayout, postDetailPath)}
    </div>
  )
}

export function repostedBody(author, content, id, isGridLayout, postDetailPath = null) {
  return (
    <div className="PostBody RepostedBody" key={`RepostedBody_${id}`}>
      <Avatar sources={author.avatar} to={`/${author.username}`} />
      {regionItems(content, null, isGridLayout, postDetailPath)}
    </div>
  )
}

export function setModels(newModels) {
  models = newModels
}

