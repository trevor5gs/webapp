import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { openModal, closeModal } from '../../actions/modals'
import { createPost, toggleEditing, toggleReposting, updatePost } from '../../actions/posts'
import { closeOmnibar } from '../../actions/omnibar'
import BlockCollection from './BlockCollection'
import ConfirmDialog from '../dialogs/ConfirmDialog'

class Editor extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    post: PropTypes.object,
    shouldLoadFromState: PropTypes.bool,
    shouldPersist: PropTypes.bool,
  };

  static defaultProps = {
    shouldLoadFromState: false,
    shouldPersist: false,
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
    const { post } = this.props
    if (!post) {
      this.launchCancelConfirm('post')
    } else if (post.isEditing) {
      this.launchCancelConfirm('edit')
    } else if (post.isReposting) {
      this.launchCancelConfirm('repost')
    } else if (post.showComments) {
      this.launchCancelConfirm('comment')
    }
  };

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  };

  launchCancelConfirm = (label) => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title={ `Cancel ${label}?` }
        onConfirm={ this.cancelConfirmed }
        onRejected={ this.closeModal }
      />))
  };

  cancelConfirmed = () => {
    const { dispatch, post } = this.props
    this.closeModal()
    dispatch(closeOmnibar())
    if (post) {
      dispatch(toggleEditing(post, false))
      dispatch(toggleReposting(post, false))
    }
    dispatch({ type: ACTION_TYPES.POST.PERSIST, payload: { collection: {}, order: [] } })
  };

  render() {
    const { post, shouldLoadFromState } = this.props
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
        shouldLoadFromState={ shouldLoadFromState }
        shouldPersist={ shouldPersist }
      />
    )
  }
}

function mapStateToProps({ json }, ownProps) {
  return {
    post: ownProps.post ? json[MAPPING_TYPES.POSTS][ownProps.post.id] : null,
  }
}

export default connect(mapStateToProps)(Editor)

