import React, { Component, PropTypes } from 'react'
import { parsePost } from '../parsers/PostParser'

class PostsAsGrid extends Component {

  static propTypes = {
    currentUser: PropTypes.object,
    gridColumnCount: PropTypes.number,
    json: PropTypes.object,
    posts: PropTypes.array.isRequired,
  };

  renderColumn(posts, index) {
    const { json, currentUser } = this.props
    return (
      <div className="Column" key={`column_${index}`}>
        {posts.map((post) =>
          <article ref={`postGrid_${post.id}`} key={post.id} className="Post PostGrid">
            {parsePost(post, json, currentUser)}
          </article>
        )}
      </div>
    )
  }

  render() {
    const { posts, gridColumnCount } = this.props
    if (!gridColumnCount) { return null }
    const columns = []
    for (let i = 0; i < gridColumnCount; i++) {
      columns.push([])
    }
    for (const index in posts) {
      if (posts[index]) {
        columns[index % gridColumnCount].push(posts[index])
      }
    }
    return (
      <div className="Posts asGrid">
        {columns.map((columnPosts, index) => this.renderColumn(columnPosts, index))}
      </div>
    )
  }
}

export default PostsAsGrid

