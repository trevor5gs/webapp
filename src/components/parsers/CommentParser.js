import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { body, setModels } from './RegionParser'
import Avatar from '../assets/Avatar'
import CommentTools from '../comments/CommentTools'

function header(comment, author) {
  if (!comment || !author) { return null }
  return (
    <header className="PostHeader CommentHeader" key={ `CommentHeader_${comment.id}` }>
      <div className="PostHeaderAuthor">
        <Link className="PostHeaderLink" to={ `/${author.username}` }>
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

class CommentParser extends Component {
  static propTypes = {
    comment: PropTypes.object,
    post: PropTypes.object,
    author: PropTypes.object,
    assets: PropTypes.any.isRequired,
    currentUser: PropTypes.object,
    isGridLayout: PropTypes.bool,
  };

  render() {
    const { comment, author, assets, currentUser, isGridLayout, post } = this.props

    if (!comment) {
      return null
    }

    setModels({ assets })
    const commentHeader = header(comment, author)
    const content = isGridLayout ? comment.summary : comment.content

    const commentBody = (
      <div className="CommentBody" key={ `CommentBody${comment.id}` } >
        { body(content, comment.id, isGridLayout) }
      </div>
    )

    const commentFooter = footer(comment, author, currentUser, post)
    setModels({})

    return (
      <div>
        {commentHeader}
        {commentBody}
        {commentFooter}
      </div>
    )
  }
}

const mapStateToProps = ({ json, profile: currentUser }, ownProps) => {
  const comment = ownProps.comment
  const author = json[MAPPING_TYPES.USERS][comment.authorId]
  const post = json[MAPPING_TYPES.POSTS][comment.postId]
  const assets = json.assets;
  return {
    assets,
    currentUser,
    author,
    post,
  }
}

export default connect(mapStateToProps)(CommentParser)
