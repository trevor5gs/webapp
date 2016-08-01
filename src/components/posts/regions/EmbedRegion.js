import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { ElloBuyButton } from '../../editor/ElloBuyButton'

export const EmbedRegion = ({ region, key }) => {
  const data = {}
  data[`data-${region.data.service}-id`] = region.data.id
  return (
    <div className="EmbedRegion" key={key}>
      <div className="embetter" {...data}>
        <Link className="EmbedRegionContent" to={region.data.url}>
          <img src={region.data.thumbnailLargeUrl} alt={region.data.service} />
        </Link>
        {
          region.linkUrl && region.linkUrl.length ?
            <ElloBuyButton to={region.linkUrl} /> :
            null
        }
      </div>
    </div>
  )
}

EmbedRegion.propTypes = {
  region: PropTypes.object,
  key: PropTypes.string,
}


