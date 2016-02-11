import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { getLinkObject } from '../base/json_helper'
import { body, regionItems, setModels } from './RegionParser'
import Avatar from '../assets/Avatar'
import ContentWarningButton from '../posts/ContentWarningButton'
import PostTools from '../posts/PostTools'
import CommentStream from '../streams/CommentStream'
import { RepostIcon } from '../posts/PostIcons'
import RelationsGroup from '../relationships/RelationsGroup'
import InlineEditor from '../../components/editor/InlineEditor'

function getPostDetailPath(author, post) {
  return `/${author.username}/post/${post.token}`
}

function commentStream(post, author) {
  return (
    <CommentStream key={`Comments_${post.id}`} post={post} author={author} />
  )
}

function header(post, author) {
  if (!post || !author) { return null }
  return (
    <header className="PostHeader" key={`PostHeader_${post.id}`}>
      <div className="PostHeaderAuthor">
        <Link className="PostHeaderLink" to={`/${author.username}`}>
          <Avatar sources={author.avatar} />
          <span>{`@${author.username}`}</span>
        </Link>
      </div>
      <RelationsGroup user={author} />
    </header>
  )
}

function repostHeader(post, repostAuthor, repostSource, repostedBy) {
  if (!post || !repostedBy) { return null }
  return (
    <header className="RepostHeader" key={`RepostHeader_${post.id}`}>
      <div className="RepostHeaderAuthor">
        <Link className="PostHeaderLink" to={`/${repostAuthor.username}`}>
          <Avatar sources={repostAuthor.avatar} />
          <span>{`@${repostAuthor.username}`}</span>
        </Link>
      </div>
      <div className="RepostHeaderReposter">
        <Link className="PostHeaderLink" to={`/${repostedBy.username}`}>
          <RepostIcon />
          {` by @${repostedBy.username}`}
        </Link>
      </div>
      <RelationsGroup user={repostAuthor} />
    </header>
  )
}

function footer(post, author, currentUser) {
  if (!author) { return null }
  return (
    <PostTools
      author={author}
      post={post}
      currentUser={currentUser}
      key={`PostTools_${post.id}`}
    />
  )
}

export function parsePost(post, author, currentUser, isGridLayout = true) {
  if (!post) { return null }
  const cells = []
  const postDetailPath = getPostDetailPath(author, post)

  if (post.repostContent && post.repostContent.length) {
    if (post.contentWarning) {
      cells.push(<ContentWarningButton post={post}/>)
    }
    // this is weird, but the post summary is
    // actually the repost summary on reposts
    if (isGridLayout) {
      cells.push(body(post.summary, post.id, isGridLayout, postDetailPath))
    } else {
      cells.push(body(post.repostContent, `repost_${post.id}`, isGridLayout, postDetailPath))
      if (post.content && post.content.length) {
        cells.push(body(post.content, post.id, isGridLayout, postDetailPath))
      }
    }
  } else {
    if (post.contentWarning) {
      cells.push(<ContentWarningButton post={post}/>)
    }

    const content = isGridLayout ? post.summary : post.content
    cells.push(body(content, post.id, isGridLayout, postDetailPath))
  }
  cells.push(footer(post, author, currentUser))
  setModels({})
  return cells
}

export function parseSummary(post, json, only = null) {
  setModels(json)
  return regionItems(post.summary, only, false)
}

function isRepost(post) {
  return post.repostContent && post.repostContent.length;
}

class PostParser extends Component {
  static propTypes = {
    assets: PropTypes.any.isRequired,
    author: PropTypes.object,
    authorLinkObject: PropTypes.object,
    currentUser: PropTypes.object,
    isEditing: PropTypes.bool,
    isGridLayout: PropTypes.bool,
    post: PropTypes.object,
    showComments: PropTypes.bool,
    sourceLinkObject: PropTypes.object,
  };

  render() {
    const { post, assets, currentUser, isEditing, isGridLayout, author, showComments } = this.props
    if (!post) { return null }

    let postHeader;
    console.log('post editing', isEditing)

    setModels({ assets })
    if (isRepost(post)) {
      const { authorLinkObject, sourceLinkObject } = this.props
      postHeader = repostHeader(post, authorLinkObject, sourceLinkObject, author)
    } else {
      postHeader = header(post, author)
    }

    return (
      <div>
        {postHeader}
        { isEditing ?
          <InlineEditor key={ JSON.stringify(post.body) } blocks={ post.body } post={ post }/> :
          parsePost(post, author, currentUser, isGridLayout)}
        {showComments ? commentStream(post, author, currentUser) : null}
      </div>)
  }
}

const mapStateToProps = ({ json, profile: currentUser }, ownProps) => {
  const post = json[MAPPING_TYPES.POSTS][ownProps.post.id]
  const author = json[MAPPING_TYPES.USERS][post.authorId]
  const assets = json.assets;

  let newProps = {
    assets,
    currentUser,
    post,
    author,
  }

  if (isRepost(post)) {
    newProps = {
      ...newProps,
      authorLinkObject: getLinkObject(post, 'repostAuthor', json),
      sourceLinkObject: getLinkObject(post, 'repostedSource', json),
    }
  }

  return newProps
}

export default connect(mapStateToProps)(PostParser)
