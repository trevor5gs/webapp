import React from 'react'
import EmbedRegion from '../posts/regions/EmbedRegion'
import ImageRegion from '../posts/regions/ImageRegion'
import TextRegion from '../posts/regions/TextRegion'

export function regionItemsForNotifications(content, postDetailPath = null) {
  const imageAssets = []
  const texts = []

  content.forEach((region, i) => {
    switch (region.kind) {
      case 'text':
        texts.push(
          <TextRegion
            content={region.data}
            isGridMode={false}
            key={`TextRegion_${i}`}
            postDetailPath={postDetailPath}
          />
        )
        break
      case 'image':
        imageAssets.push(
          <ImageRegion
            affiliateLinkURL={region.linkUrl}
            assets={assets}
            content={region.data}
            isGridMode
            isNotification
            key={`ImageRegion_${i}_${JSON.stringify(region.data)}`}
            links={region.links}
            postDetailPath={postDetailPath}
          />
        )
        break
      case 'embed':
        imageAssets.push(<EmbedRegion region={region} key={`EmbedRegion_${i}`} />)
        break
      case 'rule':
        texts.push(<hr className="NotificationRule" key={`NotificationRule_${i}`} />)
        break
      default:
        break
    }
  })
  return { assets: imageAssets, texts }
}

