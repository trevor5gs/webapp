import {
  clearJSON,
  expect,
  json,
  stub,
} from '../../spec_helper'
import subject from '../../../src/reducers/experience_updates/comments'
import * as ACTION_TYPES from '../../../src/constants/action_types'

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
  // add some comments
  stub('comment', { id: '1', authorId: '1' })
  stub('comment', { id: '2', authorId: '2' })
  stub('comment', { id: '3', authorId: '3' })
  stub('comment', { id: '4', authorId: '4' })
}

describe('comments experience update', () => {
  beforeEach(() => {
    stubJSONStore()
  })

  afterEach(() => {
    clearJSON()
  })

  describe('#deleteComment', () => {
    it('deletes the comment on request', () => {
      const comment = json.comments['1']
      expect(comment).not.to.be.undefined
      const action = { type: ACTION_TYPES.COMMENT.DELETE_REQUEST }
      action.payload = { model: comment }
      subject.deleteComment({ state: 'yo' }, json, action)
      expect(json.comments['1']).to.be.undefined
    })

    it('deletes the comment on success', () => {
      const comment = json.comments['1']
      expect(comment).not.to.be.undefined
      const action = { type: ACTION_TYPES.COMMENT.DELETE_SUCCESS }
      action.payload = { model: comment }
      subject.deleteComment({ state: 'yo' }, json, action)
      expect(json.comments['1']).to.be.undefined
    })

    it('restores the comment on failure', () => {
      const comment = json.comments['1']
      expect(comment).not.to.be.undefined
      const action = { type: ACTION_TYPES.COMMENT.DELETE_FAILURE }
      action.payload = { model: comment }
      subject.deleteComment({ state: 'yo' }, json, action)
      expect(json.comments['1']).not.to.be.undefined
    })

    it('returns the passed in state if type is not supported', () => {
      const comment = json.comments['1']
      expect(comment).not.to.be.undefined
      const action = { type: 'blah' }
      action.payload = { model: comment }
      expect(subject.deleteComment({ state: 'yo' }, json, action)).to.deep.equal({ state: 'yo' })
    })
  })
})

