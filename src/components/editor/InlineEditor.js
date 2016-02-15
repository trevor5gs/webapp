import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createPost, toggleEditing, toggleReposting, updatePost } from '../../actions/posts'
import BlockCollection from './BlockCollection'

class InlineEditor extends Component {

  static propTypes = {
    blocks: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    post: PropTypes.object,
  };

  submit = (data) => {
    const { dispatch, post } = this.props
    if (post.isReposting) {
      dispatch(toggleReposting(post, false))
      dispatch(createPost(data, post.id))
    } else if (post.isEditing) {
      dispatch(toggleEditing(post, false))
      dispatch(updatePost(post, data))
    }
  };

  cancel = () => {
    const { dispatch, post } = this.props
    dispatch(toggleEditing(post, false))
    dispatch(toggleReposting(post, false))
  };

  render() {
    const { blocks, post } = this.props
    return (
      <BlockCollection
        blocks={ blocks }
        cancelAction={ this.cancel }
        submitAction={ this.submit }
        submitText={ post.isReposting ? 'Repost' : 'Update' }
      />
    )
  }
}

export default connect()(InlineEditor)

