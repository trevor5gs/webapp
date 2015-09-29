import React from 'react'
import Avatar from '../people/Avatar'
import ImageRegion from './regions/ImageRegion'
import PostTools from './PostTools'

class PostGrid extends React.Component {

  textRegion(key, content) {
    return (
      <div key={key}
        className="TextRegion"
        dangerouslySetInnerHTML={{__html: content}} />
    )
  }

  imageRegion(key, content, links) {
    return (
      <ImageRegion key={key}
        assets={this.props.assets}
        content={content}
        links={links} />
    )
  }

  embedRegion(key, content) {
    // console.log('embed', content)
    return content
  }

  repostRegion(key, content) {
    // console.log('repost', content)
    return content
  }

  render() {
    const { post, author } = this.props
    const avatar = author.avatar.regular.url
    return (
      <div className="PostGrid">
        <header>
          <Avatar imgSrc={avatar} />
          <div className="vitals">
            <a className="username" name="username" href={`/${author.username}`}>{`@${author.username}`}</a>
          </div>
        </header>
        <section className="post-summary">
          {post.summary.map((region, i) => {
            return this[`${region.kind}Region`](i, region.data, region.links)
          })}
        </section>
        <section className="post-tools">
          <PostTools post={post} />
        </section>
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

