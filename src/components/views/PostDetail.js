import React, { PropTypes } from 'react'
import { css } from 'glamor'
import Editor from '../editor/Editor'
import PostContainer from '../../containers/PostContainer'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'
import { loadRelatedPosts } from '../../actions/posts'
import { RelatedPostsButton } from '../posts/PostRenderables'
import { TabListButtons } from '../tabs/TabList'
import { numberToHuman } from '../../lib/number_to_human'

const minBreak2 = '@media(min-width: 40em)'

const navStyles = css({
  position: 'relative',
  marginBottom: -10,
  [minBreak2]: {
    marginBottom: -10,
  },
})

const postDetailTabs = [
  { label: 'Comments', prop: 'commentsCount' },
  { label: 'Loves', prop: 'lovesCount' },
  { label: 'Reposts', prop: 'repostsCount' },
]
const generateTabs = (post) => {
  const tabs = []
  postDetailTabs.forEach((obj) => {
    const count = post.get(obj.prop)
    if (Number(count) > 0 || obj.label === 'Comments') {
      const label = count > 0 ? `${numberToHuman(count)} ${obj.label}` : obj.label
      tabs.push({
        type: obj.label.toLowerCase(),
        children: label,
      })
    }
  })
  return tabs
}

export const PostDetail = (
  { activeType, hasEditor, hasRelatedPostsButton, post, streamAction },
  { onClickDetailTab }) =>
    <MainView className="PostDetail">
      <div className="PostDetails Posts asList">
        <article className="PostList" id={`Post_${post.get('id')}`}>
          <div className="StreamContainer">
            <PostContainer postId={post.get('id')} />
            <nav {...navStyles}>
              <TabListButtons
                activeType={activeType}
                className="SearchTabList"
                key={`TabListButtons_${activeType}`}
                onTabClick={onClickDetailTab}
                tabClasses="LabelTab SearchLabelTab"
                tabs={generateTabs(post)}
              />
              {hasRelatedPostsButton && <RelatedPostsButton />}
            </nav>
            {hasEditor && activeType === 'comments' && <Editor post={post} isComment />}
          </div>
          {streamAction &&
            <StreamContainer
              action={streamAction}
              className="TabListStreamContainer"
              key={`TabListStreamContainer_${activeType}`}
              paginatorText="Load More"
              shouldInfiniteScroll={false}
            />
          }
          <StreamContainer
            action={loadRelatedPosts(post.get('id'))}
            className="RelatedPostsStreamContainer"
            shouldInfiniteScroll={false}
          />
        </article>
      </div>
    </MainView>
PostDetail.propTypes = {
  activeType: PropTypes.string.isRequired,
  hasEditor: PropTypes.bool.isRequired,
  hasRelatedPostsButton: PropTypes.bool.isRequired,
  post: PropTypes.object.isRequired,
  streamAction: PropTypes.object,
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

