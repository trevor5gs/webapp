import { clearJSON, json, stub } from '../../../stubs'
import subject from '../../../../src/reducers/experience_updates/posts'
import * as ACTION_TYPES from '../../../../src/constants/action_types'

function stubJSONStore() {
  // add some users
  stub('user', { id: '1', username: 'archer' })
  stub('user', { id: '2', username: 'lana', relationshipPriority: 'friend' })
  stub('user', { id: '3', username: 'cyril' })
  stub('user', { id: '4', username: 'pam' })
  // add some posts
  stub('post', { id: '1', token: 'token1', authorId: '1' })
  stub('post', { id: '2', token: 'token2', authorId: '2' })
  stub('post', { id: '3', token: 'token3', authorId: '3' })
  stub('post', { id: '4', token: 'token4', authorId: '4' })
}

describe('posts experience update', () => {
  beforeEach(() => {
    stubJSONStore()
  })

  afterEach(() => {
    clearJSON()
  })

  describe('#updatePostLoves', () => {
    it('returns original state if action is not love success or fail', () => {
      expect(subject.updatePostLoves(
        { state: 'yo' },
        json,
        { payload: {} }
      )).to.deep.equal({ state: 'yo' })
    })

    context('on love request', () => {
      it('handles POST', () => {
        const post = json.posts['1']
        expect(post.lovesCount).to.equal(0)
        expect(post.loved).to.be.false
        const action = { type: ACTION_TYPES.POST.LOVE_REQUEST }
        action.payload = { method: 'POST', model: post }
        action.meta = { resultKey: 'love', updateKey: 'post' }

        stub('user', { id: 'abc', relationshipPriority: 'self' })
        json.pages = { love: { ids: ['test'] } }
        subject.updatePostLoves({ state: 'yo' }, json, action)
        const updatedPost = json.posts['1']
        expect(updatedPost.lovesCount).to.equal(1)
        expect(updatedPost.loved).to.be.true
        expect(json.pages.love.ids).to.deep.equal(['test'])
      })

      it('handles DELETE', () => {
        const post = json.posts['1']
        expect(post.lovesCount).to.equal(0)
        expect(post.loved).to.be.false
        const action = { type: ACTION_TYPES.POST.LOVE_REQUEST }
        action.payload = { method: 'DELETE', model: post }
        action.meta = { resultKey: 'love', updateKey: 'post' }

        stub('user', { id: 'abc', relationshipPriority: 'self' })
        json.pages = { love: { ids: ['test'] } }
        subject.updatePostLoves({ state: 'yo' }, json, action)
        const updatedPost = json.posts['1']
        expect(updatedPost.lovesCount).to.equal(-1)
        expect(updatedPost.loved).to.be.false
      })
    })

    context('on love success', () => {
      it('handles POST', () => {
        const post = json.posts['1']
        expect(post.showLovers).to.be.undefined
        const action = { type: ACTION_TYPES.POST.LOVE_SUCCESS }
        action.payload = { method: 'POST', model: post }
        action.meta = { resultKey: 'love', updateKey: 'post' }

        stub('user', { id: 'abc', relationshipPriority: 'self' })
        json.pages = { love: { ids: ['test'] } }
        subject.updatePostLoves({ state: 'yo' }, json, action)
        const updatedPost = json.posts['1']
        expect(updatedPost.showLovers).to.be.true
        expect(json.pages.love.ids).to.deep.equal(['abc', 'test'])
      })

      it('handles DELETE', () => {
        const post = json.posts['1']
        expect(post.showLovers).to.be.undefined
        const action = { type: ACTION_TYPES.POST.LOVE_SUCCESS }
        action.payload = { method: 'DELETE', model: post }
        action.meta = { resultKey: 'love', updateKey: 'post' }

        stub('user', { id: 'abc', relationshipPriority: 'self' })
        json.pages = { love: { ids: ['test'] } }
        subject.updatePostLoves({ state: 'yo' }, json, action)
        const updatedPost = json.posts['1']
        expect(updatedPost.showLovers).to.be.false
      })
    })

    context('on love failure', () => {
      it('handles POST', () => {
        const post = json.posts['1']
        expect(post.lovesCount).to.equal(0)
        expect(post.loved).to.be.false
        const action = { type: ACTION_TYPES.POST.LOVE_FAILURE }
        action.payload = { method: 'POST', model: post }
        action.meta = { resultKey: 'love', updateKey: 'post' }

        stub('user', { id: 'abc', relationshipPriority: 'self' })
        json.pages = { love: { ids: ['test'] } }
        subject.updatePostLoves({ state: 'yo' }, json, action)
        const updatedPost = json.posts['1']
        expect(updatedPost.lovesCount).to.equal(-1)
        expect(updatedPost.loved).to.be.false
      })

      it('handles DELETE', () => {
        const post = json.posts['1']
        expect(post.lovesCount).to.equal(0)
        expect(post.loved).to.be.false
        const action = { type: ACTION_TYPES.POST.LOVE_FAILURE }
        action.payload = { method: 'DELETE', model: post }
        action.meta = { resultKey: 'love', updateKey: 'post' }

        stub('user', { id: 'abc', relationshipPriority: 'self' })
        json.pages = { love: { ids: ['test'] } }
        subject.updatePostLoves({ state: 'yo' }, json, action)
        const updatedPost = json.posts['1']
        expect(updatedPost.lovesCount).to.equal(1)
        expect(updatedPost.loved).to.be.true
      })
    })
  })
})

