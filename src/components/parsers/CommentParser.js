import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { body, setModels } from './RegionParser'
import Avatar from '../assets/Avatar'
import CommentTools from '../comments/CommentTools'
import Editor from '../../components/editor/Editor'
import Honeybadger from '../../vendor/honeybadger'

function header(comment, author) {
  if (!comment || !author) { return null }
  return (
    <header className="CommentHeader" key={`CommentHeader_${comment.id}`}>
      <div className="CommentHeaderAuthor">
        <Link className="CommentHeaderLink" to={`/${author.username}`}>
          <Avatar
            priority={author.relationshipPriority}
            sources={author.avatar}
            userId={`${author.id}`}
            username={author.username}
          />
          <span className="CommentUsername">{`@${author.username}`}</span>
        </Link>
      </div>
    </header>
  )
}

function footer(comment, author, currentUser, post) {
  if (!author) { return null }
  return (
    <CommentTools
      author={author}
      comment={comment}
      currentUser={currentUser}
      key={`CommentTools_${comment.id}`}
      post={post}
    />
  )
}

function parseComment(comment, author, currentUser, post, isGridLayout = true, json) {
  if (!comment.content) {
    // send some data to honeybadger so we can hopefully track down
    // why there isn't any content here this should be temporary
    // until we figure out how to fix this issue
    Honeybadger.notify({
      comment: JSON.stringify(comment),
      fingerprint: 'No content on comment',
      json: JSON.stringify(json),
      message: 'No content on comment',
    });
  }
  const cells = []
  cells.push(header(comment, author))
  cells.push(
    <div className="CommentBody" key={`CommentBody${comment.id}`} >
      {body(comment.content, comment.id, isGridLayout, null, true)}
    </div>
  )
  cells.push(footer(comment, author, currentUser, post))
  setModels({})
  return cells
}

/* eslint-disable react/prefer-stateless-function */
class CommentParser extends Component {
  static propTypes = {
    assets: PropTypes.any,
    author: PropTypes.object,
    comment: PropTypes.object,
    commentBody: PropTypes.array,
    currentUser: PropTypes.object,
    isEditing: PropTypes.bool,
    isGridLayout: PropTypes.bool,
    json: PropTypes.object,
    post: PropTypes.object,
  }

  render() {
    const { comment, author, assets, commentBody,
      currentUser, isEditing, isGridLayout, json, post } = this.props
    if (!comment) { return null }
    setModels({ assets })
    return (
      <div>
        {isEditing && commentBody ?
          <Editor isComment comment={comment} /> :
          parseComment(comment, author, currentUser, post, isGridLayout, json)
        }
      </div>
    )
  }
}

const mapStateToProps = ({ json, profile: currentUser }, ownProps) => {
  const comment = json[MAPPING_TYPES.COMMENTS][ownProps.comment.id]
  const author = json[MAPPING_TYPES.USERS][comment.authorId]
  const post = ownProps.post || json[MAPPING_TYPES.POSTS][comment.postId]
  const assets = json.assets
  return {
    assets,
    author,
    commentBody: comment.body,
    currentUser,
    isEditing: comment.isEditing,
    json,
    post,
  }
}

export default connect(mapStateToProps)(CommentParser)

