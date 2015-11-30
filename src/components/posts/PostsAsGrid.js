import React from 'react'
import { parsePost } from '../parsers/PostParser'

class PostsAsGrid extends React.Component {
  static propTypes = {
    posts: React.PropTypes.object,
    json: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    gridColumnCount: React.PropTypes.number,
  }

  render() {
    const { posts, json, currentUser, gridColumnCount } = this.props
    return (
      <div className="Posts asGrid">
        {posts.data.map((post) => {
          return (
            <article ref={`postGrid_${post.id}`} key={post.id} className="Post PostGrid">
              {parsePost(post, json, currentUser)}
            </article>
          )
        })}
      </div>
    )
  }
}

export default PostsAsGrid

