import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createPost, toggleEditing, updatePost } from '../../actions/posts'
import BlockCollection from './BlockCollection'

class InlineEditor extends Component {

  static propTypes = {
    blocks: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    post: PropTypes.object,
    isEditing: PropTypes.bool,
    isReposting: PropTypes.bool,
  };

  submit = (data) => {
    const { dispatch, isReposting, post } = this.props
    dispatch(toggleEditing(post, false))
    return isReposting ?
      dispatch(createPost(data, post.id)) :
      dispatch(updatePost(post, data))
  };

  cancel = () => {
    const { dispatch, post } = this.props
    dispatch(toggleEditing(post, false))
  };

  render() {
    const { blocks, isReposting } = this.props
    return (
      <BlockCollection
        blocks={ blocks }
        cancelAction={ this.cancel }
        submitAction={ this.submit }
        submitText={ isReposting ? 'Repost' : 'Update' }
      />
    )
  }
}

export default connect()(InlineEditor)

