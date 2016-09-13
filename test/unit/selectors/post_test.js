import { stub } from '../../support/stubs'
import {
  selectPropsPost,
  selectPropsPostId,
  selectPropsPostToken,
  selectPropsPostAuthorId,
  selectIsOwnPost,
  selectPostFromPropsPostId,
  selectPostFromToken,
} from '../../../src/selectors/post'


describe('post selectors', () => {
  let statePost
  let propsPost
  beforeEach(() => {
    statePost = stub('post', { authorId: 'statePost' })
    propsPost = stub('post', { authorId: 'propPost', id: '666' })
  })

  afterEach(() => {
    statePost = {}
    propsPost = {}
  })

  context('#selectPropsPost', () => {
    it('returns the correct props post', () => {
      const state = { json: { posts: statePost } }
      const props = { post: propsPost }
      expect(selectPropsPost(state, props)).to.deep.equal(propsPost)
    })
  })

  context('#selectPropsPostId', () => {
    it('returns the correct props post id', () => {
      const state = { json: { posts: statePost } }
      const props = { post: propsPost }
      expect(selectPropsPostId(state, props)).to.equal('666')
    })
  })

  context('#selectPropsPostToken', () => {
    it('returns the correct props post token', () => {
      const state = { json: { posts: statePost } }
      const props = { post: propsPost }
      expect(selectPropsPostToken(state, props)).to.equal('token')
    })
  })

  context('#selectPropsPostAuthorId', () => {
    it('returns the correct props post author id', () => {
      const state = { json: { posts: statePost } }
      const props = { post: propsPost }
      expect(selectPropsPostAuthorId(state, props)).to.equal('propPost')
    })
  })

  context('#selectIsOwnPost', () => {
    it('returns if the post is the users own', () => {
      const state = { json: { posts: statePost }, profile: { id: 'propPost' } }
      const props = { post: propsPost }
      expect(selectIsOwnPost(state, props)).to.equal(true)
      const nextState = { ...state, change: 1 }
      expect(selectIsOwnPost(nextState, props)).to.equal(true)
      expect(selectIsOwnPost.recomputations()).to.equal(1)
    })

    it('returns if the post is not the users own', () => {
      const state = { json: { posts: statePost }, profile: { id: 'statePost' } }
      const props = { post: propsPost }
      expect(selectIsOwnPost(state, props)).to.equal(false)
      const nextState = { ...state, change: 1 }
      expect(selectIsOwnPost(nextState, props)).to.equal(false)
      // 2 since the memoization is from the context block
      expect(selectIsOwnPost.recomputations()).to.equal(2)
    })
  })

  context('#selectPostFromPropsPostId', () => {
    it('returns the post from json', () => {
      const pst = stub('post')
      const state = { json: { posts: { 1: { ...pst } } } }
      const props = { post: { id: '1' } }
      expect(selectPostFromPropsPostId(state, props)).to.deep.equal(pst)
      const nextState = { ...state, change: 1 }
      expect(selectPostFromPropsPostId(nextState, props)).to.deep.equal(pst)
      expect(selectPostFromPropsPostId.recomputations()).to.equal(1)
    })
  })

  context('#selectPostFromToken', () => {
    it('returns the post from json', () => {
      const pst = stub('post')
      const state = { json: { posts: { 1: { ...pst } } } }
      const props = { post: { id: '1' }, params: { token: 'token' } }
      expect(selectPostFromToken(state, props)).to.deep.equal(pst)
    })
  })
})

