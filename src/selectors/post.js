import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { LOAD_STREAM_REQUEST } from '../constants/action_types'
import { COMMENTS, POSTS } from '../constants/mapping_types'
import { selectIsLoggedIn } from './authentication'
import { selectCategoryCollection } from './categories'
import { selectParamsToken } from './params'
import { selectId as selectProfileId } from './profile'
import { selectJson } from './store'
import { selectUsers } from './user'
import { selectStreamType, selectStreamMappingType, selectStreamPostIdOrToken } from './stream'
import { findModel } from '../helpers/json_helper'

export const selectPropsPostId = (state, props) =>
  get(props, 'postId') || get(props, 'post', Immutable.Map()).get('id')

// Memoized selectors

// Requires `postId`, `post` or `params.token` to be found in props
// If `post` is on the props, grab it's id and do a lookup on `json.posts` for the latest
// TODO: `findModel` gets calculated a lot with json being an argument :(, is this a concern?
export const selectPost = createSelector(
  [selectPropsPostId, selectParamsToken, selectJson], (id, token, json) => {
    if (id || token) {
      const findObj = id ? { id } : { token }
      return findModel(json, { collection: POSTS, findObj }) || Immutable.Map()
    }
    return Immutable.Map()
  },
)

// Properties on the post reducer
export const selectPostAuthorId = createSelector([selectPost], post => post.get('authorId'))
export const selectPostBody = createSelector([selectPost], post => post.get('body'))
export const selectPostCommentsCount = createSelector([selectPost], post => post.get('commentsCount'))
export const selectPostContent = createSelector([selectPost], post => post.get('content'))
export const selectPostContentWarning = createSelector([selectPost], post => post.get('contentWarning'))
export const selectPostCreatedAt = createSelector([selectPost], post => post.get('createdAt'))
export const selectPostHref = createSelector([selectPost], post => post.get('href'))
export const selectPostId = createSelector([selectPost], post => post.get('id'))
export const selectPostIsAdultContent = createSelector([selectPost], post => post.get('isAdultContent'))
export const selectPostLoved = createSelector([selectPost], post => post.get('loved'))
export const selectPostLovesCount = createSelector([selectPost], post => post.get('lovesCount'))
export const selectPostRepostAuthorId = createSelector([selectPost], post => post.get('repostAuthorId'))
export const selectPostRepostContent = createSelector([selectPost], post => post.get('repostContent'))
export const selectPostRepostId = createSelector([selectPost], post => post.get('repostId'))
export const selectPostRepostPath = createSelector([selectPost], post => post.get('repostPath'))
export const selectPostReposted = createSelector([selectPost], post => post.get('reposted'))
export const selectPostRepostsCount = createSelector([selectPost], post => post.get('repostsCount'))
export const selectPostShowLovers = createSelector([selectPost], post => post.get('showLovers'))
export const selectPostShowReposters = createSelector([selectPost], post => post.get('showReposters'))
export const selectPostSummary = createSelector([selectPost], post => post.get('summary'))
export const selectPostToken = createSelector([selectPost], post => post.get('token'))
export const selectPostViewsCount = createSelector([selectPost], post => post.get('viewsCount'))
export const selectPostViewsCountRounded = createSelector([selectPost], post => post.get('viewsCountRounded'))
export const selectPostWatching = createSelector([selectPost], post => post.get('watching'))

export const selectPostMetaAttributes = createSelector(
  [selectPost], post => post.get('metaAttributes', Immutable.Map()),
)

export const selectPostMetaDescription = createSelector(
  [selectPostMetaAttributes], metaAttributes => metaAttributes.get('description'),
)

export const selectPostMetaCanonicalUrl = createSelector(
  [selectPostMetaAttributes], metaAttributes => metaAttributes.get('canonicalUrl'),
)

export const selectPostMetaImages = createSelector(
  [selectPostMetaAttributes], (metaAttributes) => {
    const images = (metaAttributes.get('images') || Immutable.List()).toArray()
    const openGraphImages = images.map(image => ({ property: 'og:image', content: image }))
    const schemaImages = images.map(image => ({ name: 'image', itemprop: 'image', content: image }))
    return { openGraphImages, schemaImages }
  },
)

export const selectPostMetaRobots = createSelector(
  [selectPostMetaAttributes], metaAttributes => metaAttributes.get('robots'),
)

export const selectPostMetaTitle = createSelector(
  [selectPostMetaAttributes], metaAttributes => metaAttributes.get('title'),
)

export const selectPostMetaUrl = createSelector(
  [selectPostMetaAttributes], metaAttributes => metaAttributes.get('url'),
)

// TODO: Pull properties out of post.get('links')?


// Derived or additive properties
export const selectPostAuthor = createSelector(
  [selectUsers, selectPostAuthorId], (users, authorId) => users.get(authorId),
)

export const selectPostAuthorUsername = createSelector(
  [selectPostAuthor], author => author.get('username'),
)

export const selectPostCategories = createSelector(
  [selectPost], post => post.getIn(['links', 'categories'], Immutable.List()),
)

export const selectPostCategory = createSelector(
  [selectCategoryCollection, selectPostCategories], (collection, categories) =>
    collection && collection.get(categories ? categories.first() : null),
)

export const selectPostCategoryName = createSelector(
  [selectPostCategory], category => category && category.get('name', null),
)

export const selectPostCategorySlug = createSelector(
  [selectPostCategory], category => (category ? `/discover/${category.get('slug')}` : null),
)

export const selectPostDetailPath = createSelector(
  [selectPostAuthorUsername, selectPostToken], (username, token) => `/${username}/post/${token}`,
)

export const selectPostIsCommentsRequesting = createSelector(
  [selectStreamType, selectStreamMappingType, selectStreamPostIdOrToken,
    selectPostId, selectPostToken],
  (streamType, streamMappingType, streamPostIdOrToken, postId, postToken) =>
    streamType === LOAD_STREAM_REQUEST && streamMappingType === COMMENTS &&
    (`${streamPostIdOrToken}` === `${postId}` || `${streamPostIdOrToken}` === `${postToken}`),
)

export const selectPostIsEditing = createSelector([selectPost], post =>
  post.get('isEditing', false),
)

export const selectPostIsOwn = createSelector(
  [selectPostAuthorId, selectProfileId], (authorId, profileId) =>
    `${authorId}` === `${profileId}`,
)

// TODO: Is selectPostRepostAuthorId a thing? or do we need to look at post.link?
//        export const selectPropsRepostAuthorId = (state, props) =>
//          post.getIn(['links', 'repostAuthor', 'id'])
export const selectPostIsOwnOriginal = createSelector(
  [selectPostRepostAuthorId, selectProfileId], (repostAuthorId, profileId) =>
    `${repostAuthorId}` === `${profileId}`,
)

export const selectPostIsRepost = createSelector(
  [selectPostRepostContent], repostContent => !!(repostContent && repostContent.size),
)

export const selectPostIsReposting = createSelector([selectPost], post =>
  post.get('isReposting', false),
)

export const selectPostIsWatching = createSelector(
  [selectIsLoggedIn, selectPostWatching], (isLoggedIn, watching) => isLoggedIn && watching,
)

export const selectPostShowEditor = createSelector(
  [selectPostIsEditing, selectPostIsReposting, selectPostBody],
  (isEditing, isReposting, postBody) =>
    !!((isEditing || isReposting) && postBody),
)

