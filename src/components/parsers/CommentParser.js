import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { body, setModels } from './RegionParser'
import Avatar from '../assets/Avatar'
import CommentTools from '../comments/CommentTools'
import Editor from '../../components/editor/Editor'

function header(comment, author) {
  if (!comment || !author) { return null }
  return (
    <header className="CommentHeader" key={ `CommentHeader_${comment.id}` }>
      <div className="CommentHeaderAuthor">
        <Link className="CommentHeaderLink" to={ `/${author.username}` }>
          <Avatar sources={ author.avatar } />
          <span className="CommentUsername">{ `@${author.username}` }</span>
        </Link>
      </div>
    </header>
  )
}

function footer(comment, author, currentUser, post) {
  if (!author) { return null }
  return (
    <CommentTools
      author={ author }
      comment={ comment }
      currentUser={ currentUser }
      key={ `CommentTools_${comment.id}` }
      post={ post }
    />
  )
}

function parseComment(comment, author, currentUser, post, isGridLayout = true) {
  const cells = []
  cells.push(header(comment, author))
  cells.push(
    <div className="CommentBody" key={ `CommentBody${comment.id}` } >
      { body(comment.content, comment.id, isGridLayout) }
    </div>
  )
  cells.push(footer(comment, author, currentUser, post))
  setModels({})
  return cells
}

class CommentParser extends Component {
  static propTypes = {
    assets: PropTypes.any,
    author: PropTypes.object,
    comment: PropTypes.object,
    currentUser: PropTypes.object,
    isEditing: PropTypes.bool,
    isGridLayout: PropTypes.bool,
    post: PropTypes.object,
  };

  render() {
    const { comment, author, assets, currentUser, isGridLayout, post } = this.props
    if (!comment) { return null }
    setModels({ assets })
    return (
      <div>
        { comment.isEditing && comment.body ?
          <Editor isComment comment={ comment } /> :
          parseComment(comment, author, currentUser, post, isGridLayout)
        }
      </div>
    )
  }
}

const mapStateToProps = ({ json, profile: currentUser }, ownProps) => {
  const comment = json[MAPPING_TYPES.COMMENTS][ownProps.comment.id]
  const author = json[MAPPING_TYPES.USERS][comment.authorId]
  const post = ownProps.post || json[MAPPING_TYPES.POSTS][comment.postId]
  const assets = json.assets;
  return {
    assets,
    isEditing: comment.isEditing,
    currentUser,
    author,
    post,
  }
}

export default connect(mapStateToProps)(CommentParser)

