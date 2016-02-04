import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { parsePost } from '../parsers/PostParser'

const DumbGridPost = (props) => {
  const { post, json, currentUser } = props
  return (
    <article className="Post PostGrid">
      {parsePost(post, json, currentUser)}
    </article>
  )
}

DumbGridPost.propTypes = {
  post: PropTypes.object.isRequired,
  json: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
}

function mapGridStateToProps(state, ownProps) {
  const post = state.json.posts[ownProps.post.id]
  return {
    currentUser: state.profile,
    json: state.json,
    showComments: post.showComments,
  }
}

const GridPost = connect(mapGridStateToProps)(DumbGridPost)

class PostsAsGrid extends Component {

  static propTypes = {
    currentUser: PropTypes.object,
    gridColumnCount: PropTypes.number,
    json: PropTypes.object,
    posts: PropTypes.array.isRequired,
  };

  renderColumn(posts, index) {
    return (
      <div className="Column" key={`column_${index}`}>
        {posts.map((post) =>
           <GridPost
             ref={`postGrid_${post.id}`}
             key={post.id}
             post={post}
           />
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

