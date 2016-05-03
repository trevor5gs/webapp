import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { openModal, closeModal } from '../../actions/modals'
import { toggleEditing as toggleCommentEditing, updateComment } from '../../actions/comments'
import {
  createComment,
  createPost,
  toggleEditing,
  toggleReposting,
  updatePost,
} from '../../actions/posts'
import { closeOmnibar } from '../../actions/omnibar'
import BlockCollection from './BlockCollection'
import ConfirmDialog from '../dialogs/ConfirmDialog'

const editorUniqueIdentifiers = {}
export function getEditorId(post, comment, isComment, isZero) {
  const prefix = isComment ? 'commentEditor' : 'postEditor'
  let modelId = ''
  if (post) {
    modelId = post.id
  } else if (comment) {
    modelId = `${comment.postId}_${comment.id}`
  } else if (isZero) {
    modelId = 'Zero'
  } else {
    modelId = '0'
  }
  const fullPrefix = `${prefix}${modelId}`
  if (editorUniqueIdentifiers.hasOwnProperty(fullPrefix)) {
    return editorUniqueIdentifiers[fullPrefix]
  }
  return fullPrefix
}

class Editor extends Component {

  static propTypes = {
    autoPopulate: PropTypes.string,
    comment: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isComment: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isOwnPost: PropTypes.bool,
    onSubmit: PropTypes.func,
    post: PropTypes.object,
    shouldLoadFromState: PropTypes.bool,
    shouldPersist: PropTypes.bool,
  }

  static defaultProps = {
    autoPopulate: null,
    isComment: false,
    shouldLoadFromState: false,
    shouldPersist: false,
  }

  componentWillMount() {
    const { dispatch, shouldPersist } = this.props
    // TODO: Maybe move this into the action_types constants
    // this will cause an editor object to have an initial state
    // or get populated with it's previous state
    dispatch({
      type: 'INIT_EDITOR_ID',
      payload: {
        editorId: this.getEditorIdentifier(),
        shouldPersist,
      },
    })
  }

  getEditorIdentifier() {
    const { autoPopulate, comment, isComment, post, shouldPersist } = this.props
    return getEditorId(post, comment, isComment, autoPopulate && !shouldPersist)
  }

  clearPersistedData() {
    const { dispatch } = this.props
    dispatch({
      type: ACTION_TYPES.POST.PERSIST,
      payload: {
        editorId: this.getEditorIdentifier(),
        collection: {},
        order: [],
      },
    })
  }

  submit = (data) => {
    const { comment, dispatch, isComment, onSubmit, post } = this.props
    if (isComment) {
      if (comment && comment.isEditing) {
        dispatch(toggleCommentEditing(comment, false))
        dispatch(updateComment(comment, data))
      } else {
        dispatch(createComment(data, this.getEditorIdentifier(), post.id))
      }
    } else if (!post) {
      dispatch(closeOmnibar())
      dispatch(createPost(data, this.getEditorIdentifier()))
    } else if (post.isEditing) {
      dispatch(toggleEditing(post, false))
      dispatch(updatePost(post, data))
    } else if (post.isReposting) {
      dispatch(toggleReposting(post, false))
      const repostId = post.repostId || post.id
      const repostedFromId = post.repostId ? post.id : null
      dispatch(createPost(data, this.getEditorIdentifier(),
        repostId, repostedFromId)
      )
    }
    if (onSubmit) { onSubmit() }
    this.clearPersistedData()
  }

  cancel = () => {
    const { comment, isComment, post } = this.props
    if (isComment) {
      if (comment && comment.isEditing) {
        this.launchCancelConfirm('edit')
      } else {
        this.launchCancelConfirm('comment')
      }
    } else if (!post) {
      this.launchCancelConfirm('post')
    } else if (post.isEditing) {
      this.launchCancelConfirm('edit')
    } else if (post.isReposting) {
      this.launchCancelConfirm('repost')
    }
  }

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  launchCancelConfirm = (label) => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title={ `Cancel ${label}?` }
        onConfirm={ this.cancelConfirmed }
        onDismiss={ this.closeModal }
      />))
  }

  cancelConfirmed = () => {
    const { comment, dispatch, post, shouldPersist } = this.props
    this.closeModal()
    requestAnimationFrame(() => {
      if (this.refs.blockCollection) {
        this.refs.blockCollection.refs.wrappedInstance.clearBlocks()
      }
    })
    dispatch(closeOmnibar())
    if (post) {
      dispatch(toggleEditing(post, false))
      dispatch(toggleReposting(post, false))
    }
    if (comment) {
      dispatch(toggleCommentEditing(comment, false))
    }
    if (shouldPersist) {
      this.clearPersistedData()
    }
  }

  render() {
    const {
      autoPopulate,
      comment,
      isComment,
      isLoggedIn,
      isOwnPost,
      post,
      shouldLoadFromState,
      shouldPersist,
    } = this.props
    if (!isLoggedIn) { return null }
    let blocks = []
    let repostContent = []
    let submitText
    if (autoPopulate && !shouldPersist) {
      blocks = [{ kind: 'text', data: autoPopulate }]
      submitText = 'Post'
    } else if (isComment) {
      if (comment && comment.isEditing) {
        submitText = 'Update'
        blocks = comment.body
      } else {
        submitText = 'Comment'
      }
    } else if (!post) {
      submitText = 'Post'
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
    const editorId = this.getEditorIdentifier()
    const key = `${editorId}_${blocks.length + repostContent.length}`
    return (
      <BlockCollection
        blocks={ blocks }
        cancelAction={ this.cancel }
        editorId={ editorId }
        isComment={ isComment }
        isOwnPost={ isOwnPost }
        key={ key }
        post={ post }
        ref="blockCollection"
        repostContent={ repostContent }
        shouldLoadFromState={ shouldLoadFromState }
        shouldPersist={ shouldPersist }
        submitAction={ this.submit }
        submitText={ submitText }
      />
    )
  }
}

function mapStateToProps({ authentication, json, profile }, ownProps) {
  return {
    isLoggedIn: authentication.isLoggedIn,
    post: ownProps.post ? json[MAPPING_TYPES.POSTS][ownProps.post.id] : null,
    isOwnPost: ownProps.post && `${ownProps.post.authorId}` === `${profile.id}`,
  }
}

export default connect(mapStateToProps)(Editor)

