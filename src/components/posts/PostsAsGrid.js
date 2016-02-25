import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PostParser from '../parsers/PostParser'

const DumbGridPost = (props) => {
  const { post, showComments } = props
  return (
    <article className="Post PostGrid">
      <PostParser post={post} showComments={showComments} />
    </article>
  )
}

DumbGridPost.propTypes = {
  isEditing: PropTypes.bool,
  isReposting: PropTypes.bool,
  post: PropTypes.object.isRequired,
  showComments: PropTypes.bool,
}

function mapGridStateToProps(state, ownProps) {
  const post = state.json.posts[ownProps.post.id]
  return {
    currentUser: state.profile,
    showComments: post.showComments,
    isReposting: post.isReposting,
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
      <div className="Column" key={ `column_${index}` }>
        {posts.map((post) =>
           <GridPost
             isEditing={ post.isEditing }
             isReposting={ post.isReposting }
             key={ post.id }
             post={ post }
             ref={ `postGrid_${post.id}` }
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

