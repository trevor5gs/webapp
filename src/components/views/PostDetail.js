import React, { PropTypes } from 'react'
import { css } from 'glamor'
import { minBreak2 } from '../../styles/cso'
import Editor from '../editor/Editor'
import PostContainer from '../../containers/PostContainer'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'
import { loadRelatedPosts } from '../../actions/posts'
import { RelatedPostsButton } from '../posts/PostRenderables'
import { TabListButtons } from '../tabs/TabList'

const navStyles = css({
  position: 'relative',
  marginBottom: -10,
  [minBreak2]: {
    marginBottom: -10,
  },
})

export const PostDetail = (
  { activeType, columnCount, hasEditor, hasRelatedPostsButton, post, streamAction, tabs },
  { onClickDetailTab }) =>
    <MainView className="PostDetail">
      <div className="PostDetails Posts asList">
        <article className="PostList" id={`Post_${post.get('id')}`}>
          <div className="StreamContainer PostDetailStreamContainer">
            <PostContainer postId={post.get('id')} />
            {tabs && tabs.length > 0 &&
              <nav {...navStyles}>
                <TabListButtons
                  activeType={activeType}
                  className="SearchTabList"
                  key={`TabListButtons_${activeType}`}
                  onTabClick={onClickDetailTab}
                  tabClasses="LabelTab SearchLabelTab"
                  tabs={tabs}
                />
                {hasRelatedPostsButton && <RelatedPostsButton />}
              </nav>
            }
            {hasEditor && activeType === 'comments' && <Editor post={post} isComment />}
          </div>
          {streamAction && tabs && tabs.length > 0 &&
            <StreamContainer
              action={streamAction}
              className="TabListStreamContainer"
              key={`TabListStreamContainer_${activeType}`}
              paginatorText="Load More"
              paginatorCentered={activeType === 'loves' || activeType === 'reposts'}
              shouldInfiniteScroll={false}
            />
          }
          <StreamContainer
            action={loadRelatedPosts(post.get('id'), columnCount)}
            className="RelatedPostsStreamContainer"
            shouldInfiniteScroll={false}
          />
        </article>
      </div>
    </MainView>
PostDetail.propTypes = {
  activeType: PropTypes.string.isRequired,
  columnCount: PropTypes.number.isRequired,
  hasEditor: PropTypes.bool.isRequired,
  hasRelatedPostsButton: PropTypes.bool.isRequired,
  post: PropTypes.object.isRequired,
  streamAction: PropTypes.object,
  tabs: PropTypes.array.isRequired,
}
PostDetail.defaultProps = {
  streamAction: null,
}
PostDetail.contextTypes = {
  onClickDetailTab: PropTypes.func.isRequired,
}

export const PostDetailError = ({ children }) =>
  <MainView className="PostDetail">
    <section className="StreamContainer isError">
      {children}
    </section>
  </MainView>
PostDetailError.propTypes = {
  children: PropTypes.node.isRequired,
}

