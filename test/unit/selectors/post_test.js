import Immutable from 'immutable'
import { clearJSON, json, stub } from '../../support/stubs'
import * as selector from '../../../src/selectors/post'

describe('post selectors', () => {
  let propsPost
  let state
  beforeEach(() => {
    stub('post', { authorId: 'statePost' })
    propsPost = stub('post', { authorId: 'propPost', id: '666', links: { repostAuthor: { id: '9' } } })
    state = { json }
  })

  afterEach(() => {
    clearJSON()
  })

  context('#selectPropsPostId', () => {
    it('returns the correct props post id', () => {
      const props = { post: propsPost }
      expect(selector.selectPropsPostId(state, props)).to.equal('666')
    })
  })

  context('#selectPostIsOwn', () => {
    it('returns if the post is the users own', () => {
      state = { json, profile: Immutable.Map({ id: 'propPost' }) }
      const props = { post: propsPost }
      expect(selector.selectPostIsOwn(state, props)).to.equal(true)
      state.change = 1
      expect(selector.selectPostIsOwn(state, props)).to.equal(true)
      expect(selector.selectPostIsOwn.recomputations()).to.equal(1)
    })

    it('returns if the post is not the users own', () => {
      state = { profile: Immutable.Map({ id: 'statePost' }) }
      const props = { post: propsPost }
      expect(selector.selectPostIsOwn(state, props)).to.equal(false)
      state.change = 1
      expect(selector.selectPostIsOwn(state, props)).to.equal(false)
      // 2 since the memoization is from the context block
      expect(selector.selectPostIsOwn.recomputations()).to.equal(2)
    })
  })

  context('#selectPostMetaAttributes', () => {
    it('returns the post meta attributes', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      const attr = Immutable.fromJS({
        canonicalUrl: null,
        description: 'meta post description',
        images: ['meta-post-image-0.jpg', 'meta-post-image-1.jpg'],
        robots: 'index, follow',
        title: 'meta post title',
        url: 'https://ello.co/author/post/meta-url',
      })
      state = { json }
      expect(selector.selectPostMetaAttributes(state, props)).to.deep.equal(attr)
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
})

