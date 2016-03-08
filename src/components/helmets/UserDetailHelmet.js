import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'

export const UserDetailHelmet = ({ user }) => {
  const title = `${user.username} | Ello`
  const image = user.coverImage && user.coverImage.optimized ? user.coverImage.optimized.url : null
  const description = `See ${user.username}'s work on Ello.`
  const robots = user.badForSeo ? 'noindex, follow' : 'index, follow'
  return (
    <Helmet
      title={ title }
      meta={[
        { name: 'robots', content: robots },
        { name: 'name', itemprop: 'name', content: title },
        { name: 'description', itemprop: 'description', content: description },
        { name: 'image', itemprop: 'image', content: image },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
      ]}
    />
  )
}

UserDetailHelmet.propTypes = {
  user: PropTypes.object,
}

