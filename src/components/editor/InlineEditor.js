import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { createPost, toggleEditing, toggleReposting, updatePost } from '../../actions/posts'
import { closeOmnibar } from '../../actions/omnibar'
import BlockCollection from './BlockCollection'

class InlineEditor extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    post: PropTypes.object,
  };

  submit = (data) => {
    const { dispatch, post } = this.props
    if (!post) {
      dispatch(closeOmnibar())
      dispatch(createPost(data))
    } else if (post.isReposting) {
      dispatch(toggleReposting(post, false))
      dispatch(createPost(data, post.repostId || post.id))
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
    const { post } = this.props
    let blocks = []
    let repostContent = []
    let submitText = 'Post'
    if (!post) {
      // console.log('create new post')
    } else if (post.showComments) {
      submitText = 'Comment'
      // console.log('create new comment')
    } else if (post.isReposting) {
      submitText = 'Repost'
      if (post.repostId) {
        repostContent = post.repostContent
      } else {
        repostContent = post.content
      }
    } else if (post.isEditing) {
      submitText = 'Update'
      if (post.repostContent && post.repostContent.length) {
        repostContent = post.repostContent
      }
      if (post.body) {
        blocks = post.body
      }
    }
    return (
      <BlockCollection
        key={ blocks.length + repostContent.length }
        blocks={ blocks }
        cancelAction={ this.cancel }
        repostContent={ repostContent }
        submitAction={ this.submit }
        submitText={ submitText }
      />
    )
  }
}

function mapStateToProps({ json }, ownProps) {
  return {
    post: ownProps.post ? json[MAPPING_TYPES.POSTS][ownProps.post.id] : null,
  }
}

export default connect(mapStateToProps)(InlineEditor)

