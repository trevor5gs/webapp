import React, { PropTypes } from 'react'
import Editor from '../editor/Editor'
import { PostDetailHelmet } from '../helmets/PostDetailHelmet'
import PostContainer from '../../containers/PostContainer'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'

export const PostDetail = ({ author, hasEditor, post, streamAction }) =>
  <MainView className="PostDetail">
    {author && post ? <PostDetailHelmet author={author} post={post} /> : null}
    <div className="PostDetails Posts asList">
      <article className="PostList" id={`Post_${post ? post.id : '_'}`}>
        <div className="StreamContainer">
          {author && post ? <PostContainer isGridMode={false} isPostDetail post={post} /> : null}
          {hasEditor && post ? <Editor post={post} isComment /> : null}
        </div>
        {streamAction ?
          <StreamContainer action={streamAction} className="CommentStreamContainer" /> :
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
    <section className="StreamContainer hasErrored">
      {children}
    </section>
  </MainView>

PostDetailError.propTypes = {
  children: PropTypes.node.isRequired,
}

