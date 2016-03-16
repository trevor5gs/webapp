import { expect, isFSA } from '../spec_helper'
import * as subject from '../../src/actions/posts'

describe('posts.js', () => {
  describe('#loadPostDetail', () => {
    it('returns the expected action', () => {
      const action = subject.loadPostDetail('~my_sweet_token')
      expect(isFSA(action)).to.be.true
      expect(action.type).to.equal('POST.DETAIL')
      expect(action.payload.endpoint.path).to.contain('/posts/~my_sweet_token')
      expect(action.meta.mappingType).to.equal('posts')
      expect(action.meta.updateResult).to.be.false
    })
  })
})
