import Immutable from 'immutable'
import {
  clearJSON,
  json,
  stub,
  stubCategories,
  stubPost,
  stubTextRegion,
  stubImageRegion,
  stubEmbedRegion,
} from '../../support/stubs'
import * as selector from '../../../src/selectors/post'

describe('post selectors', () => {
  let propsPost
  let state
  beforeEach(() => {
    stub('post', { authorId: 'statePost', token: 'token1' })
    stub('post', { id: '100', authorId: '666', repostContent: [stubTextRegion()] })
    stub('user', { id: '666', username: '666-username' })
    stub('user', { id: '9', username: 'reposter-username' })
    stubCategories()
    propsPost = stub('post', {
      authorId: '666',
      body: [stubTextRegion(), stubImageRegion(), stubEmbedRegion()],
      commentsCount: 12,
      content: [stubTextRegion(), stubImageRegion(), stubEmbedRegion()],
      contentWarning: 'Content Warning!',
      createdAt: 'Today',
      href: '/post-href',
      id: '666',
      links: {
        repostAuthor: { id: '9' },
        categories: [1, 4],
      },
      loved: true,
      lovesCount: 10,
      repostContent: [stubTextRegion()],
      repostId: '667',
      repostPath: '/repost-path',
      reposted: true,
      repostsCount: 13,
      showComments: true,
      showLovers: true,
      showReposters: true,
      summary: [stubTextRegion(), stubImageRegion()],
      token: 'token666',
      viewsCount: 1666,
      watching: true,
    })
    state = { json }
  })

  afterEach(() => {
    clearJSON()
  })

  context('#selectPropsPostId', () => {
    it('returns the correct props post id from a postId', () => {
      const props = { postId: '666' }
      expect(selector.selectPropsPostId(state, props)).to.equal('666')
    })

    it('returns the correct props post id from a post', () => {
      const props = { post: propsPost }
      expect(selector.selectPropsPostId(state, props)).to.equal('666')
    })
  })

  context('#selectPropsPostIsRelated', () => {
    it('returns the correct props isRelatedPost', () => {
      const props = { isRelatedPost: true }
      expect(selector.selectPropsPostIsRelated(state, props)).to.equal(true)
    })

    it('returns the correct props post id from a post', () => {
      const props = {}
      expect(selector.selectPropsPostIsRelated(state, props)).to.equal(false)
    })
  })


  context('#selectPosts', () => {
    it('returns posts model out of json', () => {
      state = { json }
      expect(selector.selectPosts(state)).to.deep.equal(state.json.get('posts'))
    })
  })

  context('#selectPost', () => {
    it('returns a post from a postId', () => {
      state = { json }
      const props = { postId: '1' }
      const post = selector.selectPost(state, props)
      expect(post).to.deep.equal(state.json.get('posts').first())
    })

    it('returns an empty Map if postId is not found', () => {
      state = { json }
      const props = { postId: '166666' }
      const post = selector.selectPost(state, props)
      expect(post).to.deep.equal(Immutable.Map())
    })

    it('returns a post from a post.postId', () => {
      state = { json }
      const props = { post: state.json.get('posts').first() }
      const post = selector.selectPost(state, props)
      expect(post).to.deep.equal(state.json.get('posts').first())
    })

    it('returns an empty Map if post.postId is not found', () => {
      state = { json }
      const props = { post: stubPost({ id: '99999' }, false) }
      const post = selector.selectPost(state, props)
      expect(post).to.deep.equal(Immutable.Map())
    })

    it('returns a post from a token', () => {
      state = { json }
      const props = { params: { token: 'token666' } }
      const post = selector.selectPost(state, props)
      expect(post).to.deep.equal(state.json.getIn(['posts', '666']))
    })

    it('returns an empty Map if token is not found', () => {
      state = { json }
      const props = { params: { token: 'token9999' } }
      const post = selector.selectPost(state, props)
      expect(post).to.deep.equal(Immutable.Map())
    })

    it('returns an empty Map if id and token is not found', () => {
      state = { json }
      const props = {}
      const post = selector.selectPost(state, props)
      expect(post).to.deep.equal(Immutable.Map())
    })

    it('returns an empty Map if post is not found', () => {
      state = { json }
      const props = {}
      const post = selector.selectPost({ json: Immutable.Map() }, props)
      expect(post).to.deep.equal(Immutable.Map())
    })
  })

  context('#addAssetToRegion', () => {
    it('returns the region if the kind is not text', () => {
      const region = Immutable.fromJS({
        kind: 'text',
      })
      expect(selector.addAssetToRegion(region, {})).to.equal(region)
    })

    it('sets an asset on the region from links', () => {
      const region = Immutable.fromJS({
        kind: 'image',
        links: { assets: '1' },
      })
      const assets = Immutable.fromJS({ 1: 'blah' })
      const newRegion = selector.addAssetToRegion(region, assets)
      expect(newRegion.get('asset')).to.equal('blah')
    })

    it('sets an asset on the region from the content url for notifications', () => {
      const region = Immutable.fromJS({
        kind: 'image',
        content: { url: '/asset/attachment/1/' },
      })
      const assets = Immutable.fromJS({ 1: 'blah' })
      const newRegion = selector.addAssetToRegion(region, assets)
      expect(newRegion.get('asset')).to.equal('blah')
    })

    it('doesn\'t set an asset on the region if no asset exists', () => {
      const region = Immutable.fromJS({
        kind: 'image',
        links: { assets: '2' },
      })
      const assets = Immutable.fromJS({ 1: 'blah' })
      const newRegion = selector.addAssetToRegion(region, assets)
      expect(newRegion).to.equal(region)
    })
  })

  context('#selectPostAuthorId', () => {
    it('returns the post authorId', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostAuthorId(state, props)
      expect(result).to.deep.equal('666')
    })
  })

  context('#selectPostBody', () => {
    it('returns the post body', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostBody(state, props)
      expect(result.size).to.equal(3)
    })
  })

  context('#selectPostCommentsCount', () => {
    it('returns the post comments count', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostCommentsCount(state, props)
      expect(result).to.equal(12)
    })

    it('ensures the comment count does not fall below 0', () => {
      state = { json: state.json.setIn(['posts', '666', 'commentsCount'], -1) }
      const props = { postId: '666' }
      const result = selector.selectPostCommentsCount(state, props)
      expect(result).to.equal(0)
    })
  })

  context('#selectPostContent', () => {
    it('returns the post content', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostBody(state, props)
      expect(result.size).to.equal(3)
    })
  })

  context('#selectPostContentWarning', () => {
    it('returns the post content warning', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostContentWarning(state, props)
      expect(result).to.equal('Content Warning!')
    })
  })

  context('#selectPostCreatedAt', () => {
    it('returns the post created at', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostCreatedAt(state, props)
      expect(result).to.equal('Today')
    })
  })

  context('#selectPostHref', () => {
    it('returns the post href', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostHref(state, props)
      expect(result).to.equal('/post-href')
    })
  })

  context('#selectPostId', () => {
    it('returns the post id', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostId(state, props)
      expect(result).to.equal('666')
    })
  })

  context('#selectPostIsAdultContent', () => {
    it('returns the post is adult content', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostIsAdultContent(state, props)
      expect(result).to.equal(false)
    })
  })

  context('#selectPostLoved', () => {
    it('returns the post is loved', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostLoved(state, props)
      expect(result).to.equal(true)
    })
  })

  context('#selectPostLovesCount', () => {
    it('returns the post loves count', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostLovesCount(state, props)
      expect(result).to.equal(10)
    })

    it('ensures the loves count does not fall below 0', () => {
      state = { json: state.json.setIn(['posts', '666', 'lovesCount'], -5) }
      const props = { postId: '666' }
      const result = selector.selectPostLovesCount(state, props)
      expect(result).to.equal(0)
    })
  })

  context('#selectPostMetaAttributes', () => {
    it('returns the post meta attributes', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      const attr = Immutable.fromJS({
        canonicalUrl: null,
        description: 'meta post description',
        images: ['meta-post-image-0.jpg', 'meta-post-image-1.jpg'],
        embeds: ['meta-post-embed-0.mp4', 'meta-post-embed-1.mp4'],
        robots: 'index, follow',
        title: 'meta post title',
        url: 'https://ello.co/author/post/meta-url',
      })
      state = { json }
      expect(selector.selectPostMetaAttributes(state, props)).to.deep.equal(attr)
    })
  })

  context('#selectPostRepostContent', () => {
    it('returns the post repost content', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostRepostContent(state, props)
      expect(result.size).to.equal(1)
    })
  })

  context('#selectPostRepostId', () => {
    it('returns the post repost id', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostRepostId(state, props)
      expect(result).to.equal('667')
    })
  })

  context('#selectPostReposted', () => {
    it('returns the post is reposted', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostReposted(state, props)
      expect(result).to.equal(true)
    })
  })

  context('#selectPostRepostsCount', () => {
    it('returns the post reposted count', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostRepostsCount(state, props)
      expect(result).to.equal(13)
    })

    it('ensures the reposts count does not fall below 0', () => {
      state = { json: state.json.setIn(['posts', '666', 'repostsCount'], -2) }
      const props = { postId: '666' }
      const result = selector.selectPostRepostsCount(state, props)
      expect(result).to.equal(0)
    })
  })

  context('#selectPostShowComments', () => {
    it('returns if the post shows comments', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostShowComments(state, props)
      expect(result).to.equal(true)
    })
  })

  context('#selectPostShowLovers', () => {
    it('returns if the post shows lovers', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostShowLovers(state, props)
      expect(result).to.equal(true)
    })
  })

  context('#selectPostShowReposters', () => {
    it('returns if the post shows reposters', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostShowReposters(state, props)
      expect(result).to.equal(true)
    })
  })

  context('#selectPostSummary', () => {
    it('returns the post summary', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostSummary(state, props)
      expect(result.size).to.equal(2)
    })
  })

  context('#selectPostToken', () => {
    it('returns the post token', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostToken(state, props)
      expect(result).to.equal('token666')
    })
  })

  context('#selectPostViewsCount', () => {
    it('returns the post views count', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostViewsCount(state, props)
      expect(result).to.equal(1666)
    })

    it('ensures the posts views count does not fall below 0', () => {
      state = { json: state.json.setIn(['posts', '666', 'viewsCount'], -6) }
      const props = { postId: '666' }
      const result = selector.selectPostViewsCount(state, props)
      expect(result).to.equal(0)
    })
  })

  context('#selectPostViewsCountRounded', () => {
    it('returns the post views count rounded', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostViewsCountRounded(state, props)
      expect(result).to.equal('1.7K')
    })
  })

  context('#selectPostWatching', () => {
    it('returns the post watching property', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostWatching(state, props)
      expect(result).to.equal(true)
    })
  })

  context('#selectPostMetaDescription', () => {
    it('returns the post meta description', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaDescription(state, props)).to.equal('meta post description')
    })
  })

  context('#selectPostMetaRobots', () => {
    it('returns the post meta robot instructions', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaRobots(state, props)).to.deep.equal('index, follow')
    })
  })

  context('#selectPostMetaTitle', () => {
    it('returns the post meta title', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaTitle(state, props)).to.equal('meta post title')
    })
  })

  context('#selectPostMetaUrl', () => {
    it('returns the post meta url', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaUrl(state, props)).to.equal('https://ello.co/author/post/meta-url')
    })
  })

  context('#selectPostMetaCanonicalUrl', () => {
    it('returns the post canonical url', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaCanonicalUrl(state, props)).to.deep.equal(null)
      state = { json: state.json.setIn(['posts', '1', 'metaAttributes', 'canonicalUrl'], 'meta-canonicalUrl') }
      expect(selector.selectPostMetaCanonicalUrl(state, props)).to.deep.equal('meta-canonicalUrl')
    })
  })

  context('#selectPostMetaEmbeds', () => {
    it('returns the meta embeds for a post', () => {
      const result = {
        openGraphEmbeds: [
          { property: 'og:video', content: 'meta-post-embed-0.mp4' },
          { property: 'og:video', content: 'meta-post-embed-1.mp4' },
        ],
      }
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaEmbeds(state, props)).to.deep.equal(result)
    })
  })

  context('#selectPostMetaImages', () => {
    it('returns the meta images (image/embed) for a post', () => {
      const result = {
        openGraphImages: [
          { property: 'og:image', content: 'meta-post-image-0.jpg' },
          { property: 'og:image', content: 'meta-post-image-1.jpg' },
        ],
        schemaImages: [
          { name: 'image', itemprop: 'image', content: 'meta-post-image-0.jpg' },
          { name: 'image', itemprop: 'image', content: 'meta-post-image-1.jpg' },
        ],
      }
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaImages(state, props)).to.deep.equal(result)
    })
  })

  context('#selectPostAuthor', () => {
    it('returns the post author', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostAuthor(state, props)
      expect(result).to.equal(state.json.getIn(['users', '666']))
    })
  })

  context('#selectPostAuthorUsername', () => {
    it('returns the post author username', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostAuthorUsername(state, props)
      expect(result).to.equal(state.json.getIn(['users', '666', 'username']))
    })
  })

  context('#selectPostRepostAuthorId', () => {
    it('returns the post repost author id', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostRepostAuthorId(state, props)
      expect(result).to.equal('9')
    })
  })

  context('#selectPostRepostAuthor', () => {
    it('returns the post repost author', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostRepostAuthor(state, props)
      expect(result).to.equal(state.json.getIn(['users', '9']))
    })
  })

  context('#selectPostRepostAuthorWithFallback', () => {
    it('returns the post repost author', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostRepostAuthorWithFallback(state, props)
      expect(result).to.equal(state.json.getIn(['users', '9']))
    })

    it('returns the post author as a fallback', () => {
      state = { json }
      const props = { postId: '100' }
      const result = selector.selectPostRepostAuthorWithFallback(state, props)
      expect(result).to.equal(state.json.getIn(['users', '666']))
    })
  })

  context('#selectPostCategories', () => {
    it('returns the post categories list', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostCategories(state, props)
      expect(result).to.equal(Immutable.List([1, 4]))
    })
  })

  context('#selectPostCategory', () => {
    it('returns the first item in the post categories list', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostCategory(state, props)
      expect(result).to.equal(state.json.getIn(['categories', '1']))
    })
  })

  context('#selectPostCategoryName', () => {
    it('returns the first item name in the post categories list', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostCategoryName(state, props)
      expect(result).to.equal('Featured')
    })
  })

  context('#selectPostCategorySlug', () => {
    it('returns the first item slug in the post categories list', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostCategorySlug(state, props)
      expect(result).to.equal('/discover/featured')
    })
  })

  context('#selectPostDetailPath', () => {
    it('returns the post detail path', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostDetailPath(state, props)
      expect(result).to.equal('/666-username/post/token666')
    })
  })

  context('#selectPostIsCommentsRequesting', () => {
    it('selects the state around requesting comments for a post')
  })

  context('#selectPostIsEditing', () => {
    it('returns the state of isEditing on the post', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostIsEditing(state, props)
      expect(result).to.equal(false)
    })
  })

  context('#selectPostIsEmpty', () => {
    it('returns whether the user is emtpy (false)', () => {
      const props = { postId: '666' }
      const result = selector.selectPostIsEmpty(state, props)
      expect(result).to.equal(false)
    })

    it('returns whether the user is emtpy (true)', () => {
      const props = { postId: '1000' }
      const result = selector.selectPostIsEmpty(state, props)
      expect(result).to.equal(true)
    })
  })

  context('#selectPostIsGridMode', () => {
    it('returns the state of isGridMode on the post on post detail', () => {
      state = {
        json,
        routing: Immutable.fromJS({
          location: { pathname: '/666-username/post/token666' },
        }),
        gui: Immutable.fromJS({ isGridMode: true }),
      }
      const props = { postId: '666' }
      const result = selector.selectPostIsGridMode(state, props)
      expect(result).to.equal(false)
    })

    it('returns the state of isGridMode on the post from a profile', () => {
      state = {
        json,
        routing: Immutable.fromJS({
          location: { pathname: '/666-username/' },
        }),
        gui: Immutable.fromJS({ isGridMode: true }),
      }
      const props = { postId: '666' }
      const result = selector.selectPostIsGridMode(state, props)
      expect(result).to.equal(true)
    })
  })

  context('#selectPostIsOwn', () => {
    it('returns if the post is the users own', () => {
      state = { json, profile: Immutable.Map({ id: '666' }) }
      const props = { post: propsPost }
      expect(selector.selectPostIsOwn(state, props)).to.equal(true)
      state.change = 1
      expect(selector.selectPostIsOwn(state, props)).to.equal(true)
      expect(selector.selectPostIsOwn.recomputations()).to.equal(1)
    })

    it('returns if the post is not the users own', () => {
      state = { json, profile: Immutable.Map({ id: 'statePost' }) }
      const props = { post: propsPost }
      expect(selector.selectPostIsOwn(state, props)).to.equal(false)
      state.change = 1
      expect(selector.selectPostIsOwn(state, props)).to.equal(false)
      // 2 since the memoization is from the context block
      expect(selector.selectPostIsOwn.recomputations()).to.equal(2)
    })
  })

  context('#selectPostIsOwnOriginal', () => {
    it('returns the state of isEditing on the post', () => {
      state = { json, profile: Immutable.Map({ id: '9' }) }
      const props = { postId: '666' }
      const result = selector.selectPostIsOwnOriginal(state, props)
      expect(result).to.equal(true)
    })

    it('returns the state of isEditing on the post', () => {
      state = { json, profile: Immutable.Map({ id: '100' }) }
      const props = { postId: '666' }
      const result = selector.selectPostIsOwnOriginal(state, props)
      expect(result).to.equal(false)
    })
  })

  context('#selectPostIsRepost', () => {
    it('returns if the post is a repost', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostIsRepost(state, props)
      expect(result).to.equal(true)
    })
  })

  context('#selectPostIsReposting', () => {
    it('returns the state of isReposting on the post', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostIsReposting(state, props)
      expect(result).to.equal(false)
    })
  })

  context('#selectPostIsWatching', () => {
    it('returns the state of watching on the post', () => {
      state = { json, authentication: Immutable.Map({ isLoggedIn: true }) }
      const props = { postId: '666' }
      const result = selector.selectPostIsWatching(state, props)
      expect(result).to.equal(true)
    })
  })

  context('#selectPostRepostAuthor', () => {
    it('returns the post repost author', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostRepostAuthor(state, props)
      expect(result).to.equal(state.json.getIn(['users', '9']))
    })
  })

  context('#selectPostRepostAuthorWithFallback', () => {
    it('returns the post repost author', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostRepostAuthorWithFallback(state, props)
      expect(result).to.equal(state.json.getIn(['users', '9']))
    })

    it('returns the post author as a fallback', () => {
      state = { json }
      const props = { postId: '100' }
      const result = selector.selectPostRepostAuthorWithFallback(state, props)
      expect(result).to.equal(state.json.getIn(['users', '666']))
    })
  })

  context('#selectPostShowEditor', () => {
    it('returns if the post editor should be shown', () => {
      state = { json }
      const props = { postId: '666' }
      const result = selector.selectPostShowEditor(state, props)
      expect(result).to.equal(false)
    })

    it('returns if the post editor should be shown after setting isEditing', () => {
      state = { json }
      state = { json: state.json.setIn(['posts', '666', 'isEditing'], true) }
      const props = { postId: '666' }
      const result = selector.selectPostShowEditor(state, props)
      expect(result).to.equal(true)
    })

    it('returns false if the post is related', () => {
      state = { json }
      state = { json: state.json.setIn(['posts', '666', 'isEditing'], true) }
      const props = { postId: '666', isRelatedPost: true }
      const result = selector.selectPostShowEditor(state, props)
      expect(result).to.equal(false)
    })
  })

  context('#selectPostShowCommentEditor', () => {
    it('returns if the post comment editor should be shown', () => {
      state = {
        json,
        routing: Immutable.fromJS({
          location: { pathname: '/666-username/post/token666' },
        }),
      }
      const props = { postId: '666' }
      const result = selector.selectPostShowCommentEditor(state, props)
      expect(result).to.equal(false)
    })

    it('returns if the post comment editor should be shown after setting showEditor', () => {
      state = { json }
      state = { json: state.json.setIn(['posts', '666', 'isEditing'], true) }
      const props = { postId: '666' }
      const result = selector.selectPostShowEditor(state, props)
      expect(result).to.equal(true)
    })

    it('returns false if the post is related', () => {
      state = { json }
      state = { json: state.json.setIn(['posts', '666', 'isEditing'], true) }
      const props = { postId: '666', isRelatedPost: true }
      const result = selector.selectPostShowEditor(state, props)
      expect(result).to.equal(false)
    })
  })

  context('#selectPostShowLoversDrawer', () => {
    beforeEach(() => {
      state = {
        json,
        gui: Immutable.fromJS({ isGridMode: false }),
        routing: Immutable.fromJS({
          location: { pathname: '/666-username/post/token666' },
        }),
      }
    })

    it('returns if the post lovers drawer should be shown', () => {
      const props = { postId: '666' }
      const result = selector.selectPostShowLoversDrawer(state, props)
      expect(result).to.equal(true)
    })

    it('returns false if the post is related', () => {
      const props = { postId: '666', isRelatedPost: true }
      const result = selector.selectPostShowLoversDrawer(state, props)
      expect(result).to.equal(false)
    })
  })

  context('#selectPostShowRepostersDrawer', () => {
    beforeEach(() => {
      state = {
        json,
        gui: Immutable.fromJS({ isGridMode: false }),
        routing: Immutable.fromJS({
          location: { pathname: '/666-username/post/token666' },
        }),
      }
    })

    it('returns if the post reposters drawer should be shown', () => {
      const props = { postId: '666' }
      const result = selector.selectPostShowRepostersDrawer(state, props)
      expect(result).to.equal(true)
    })

    it('returns false if the post is related', () => {
      const props = { postId: '666', isRelatedPost: true }
      const result = selector.selectPostShowRepostersDrawer(state, props)
      expect(result).to.equal(false)
    })
  })
})

