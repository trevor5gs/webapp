import React, { PropTypes } from 'react'
import Editor from '../editor/Editor'
import { PostDetailHelmet } from '../helmets/PostDetailHelmet'
import PostParser from '../parsers/PostParser'
import StreamComponent from '../streams/StreamComponent'
import { MainView } from '../views/MainView'

export const PostDetail = ({ author, hasEditor, post, streamAction }) =>
  <MainView className="PostDetail">
    {author && post ? <PostDetailHelmet author={author} post={post} /> : null}
    <div className="PostDetails Posts asList">
      <article className="PostList" id={`Post_${post ? post.id : '_'}`}>
        <div className="StreamContainer">
          {author && post ? <PostParser isGridLayout={false} isPostDetail post={post} /> : null}
          {hasEditor && post ? <Editor post={post} isComment /> : null}
        </div>
        {streamAction ?
          <StreamComponent action={streamAction} className="CommentStreamComponent" /> :
          null
        }
      </article>
    </div>
  </MainView>

PostDetail.propTypes = {
  author: PropTypes.object,
  hasEditor: PropTypes.bool,
  post: PropTypes.object,
  streamAction: PropTypes.object,
}


export const PostDetailError = ({ children }) =>
  <MainView className="PostDetail">
    <section className="StreamComponent hasErrored">
      {children}
    </section>
  </MainView>

PostDetailError.propTypes = {
  children: PropTypes.node.isRequired,
}

