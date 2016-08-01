import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { isEqual, pick } from 'lodash'
import * as MAPPING_TYPES from '../constants/mapping_types'
import Editor from '../components/editor/Editor'
import {
  CommentBody,
  CommentFooter,
  CommentHeader,
} from '../components/comments/CommentRenderables'

export function shouldContainerUpdate(thisProps, nextProps) {
  if (!nextProps.comment) { return false }
  const pickProps = ['commentBody', 'isEditing']
  const thisCompare = pick(thisProps, pickProps)
  const nextCompare = pick(nextProps, pickProps)
  return !isEqual(thisCompare, nextCompare)
}

export function mapStateToProps(state, props) {
  const { gui, json, profile } = state
  const comment = json[MAPPING_TYPES.COMMENTS][props.comment.id]
  const author = json[MAPPING_TYPES.USERS][comment.authorId]
  const post = props.post || json[MAPPING_TYPES.POSTS][comment.postId]
  const assets = json.assets
  return {
    assets,
    author,
    commentBody: comment.body,
    currentUser: profile,
    isEditing: comment.isEditing,
    isGridMode: gui.isGridMode,
    post,
  }
}

class CommentContainer extends Component {

  static propTypes = {
    assets: PropTypes.any,
    author: PropTypes.object,
    comment: PropTypes.object,
    commentBody: PropTypes.array,
    currentUser: PropTypes.object,
    isEditing: PropTypes.bool,
    isGridMode: PropTypes.bool,
    post: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return shouldContainerUpdate(this.props, nextProps)
  }

  render() {
    const { comment, assets, author, commentBody,
      currentUser, isEditing, isGridMode, post } = this.props
    if (!comment) { return null }
    return (
      <div>
        {!isEditing ?
          <CommentHeader author={author} comment={comment} /> :
          null
        }
        {isEditing && commentBody ?
          <Editor isComment comment={comment} /> :
          <CommentBody
            assets={assets}
            author={author}
            comment={comment}
            currentUser={currentUser}
            isGridMode={isGridMode}
            post={post}
          />
        }
        <CommentFooter
          author={author}
          comment={comment}
          currentUser={currentUser}
          post={post}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(CommentContainer)

