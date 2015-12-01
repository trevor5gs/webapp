import React from 'react'
import { parsePost } from '../parsers/PostParser'

class PostsAsGrid extends React.Component {
  static propTypes = {
    posts: React.PropTypes.object,
    json: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    gridColumnCount: React.PropTypes.number,
  }

  renderColumn(posts, index) {
    const { json, currentUser } = this.props
    return (
      <div className="Column" key={`column_${index}`}>
        {posts.map((post) => {
          return (
            <article ref={`postGrid_${post.id}`} key={post.id} className="Post PostGrid">
              {parsePost(post, json, currentUser)}
            </article>
          )
        })}
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
    for (const index in posts.data) {
      if (posts.data[index]) {
        columns[index % gridColumnCount].push(posts.data[index])
      }
    }
    return (
      <div className="Posts asGrid">
        {columns.map((column, index) => {
          return this.renderColumn(column, index)
        })}
      </div>
    )
  }
}

export default PostsAsGrid

