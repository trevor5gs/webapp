import React from 'react'
import Avatar from '../people/Avatar'

class PostGrid extends React.Component {

  textRegion(content) {
    console.log('text', content)
    return <div dangerouslySetInnerHTML={{__html: content}} />
  }

  imageRegion(content, links) {
    const { assets } = this.props
    const asset = assets[links.assets].attachment
    console.log('asset', asset)
    const size = window.innerWidth > 375 ? 'hdpi' : 'mdpi'
    return <img
      alt={asset[size].url}
      height={asset[size].metadata.height}
      src={asset[size].url}
      width={asset[size].metadata.width} />
  }

  embedRegion(content) {
    console.log('embed', content)
    return content
  }

  repostRegion(content) {
    console.log('repost', content)
    return content
  }

  render() {
    const { post, author } = this.props
    const avatar = author.avatar.regular.url
    return (
      <div className="PostGrid" >
        <Avatar imgSrc={avatar} />
        <div>@{author.username}</div>
        {post.content.map((region, i) => {
          console.log('region', region)
          return this[`${region.kind}Region`](region.data, region.links)
        })}
      </div>
    )
  }
}

PostGrid.propTypes = {
  post: React.PropTypes.shape({
  }).isRequired,
  author: React.PropTypes.shape({
  }).isRequired,
  assets: React.PropTypes.shape({
  }).isRequired,
}

export default PostGrid

