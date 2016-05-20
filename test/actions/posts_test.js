import { expect, isFSA } from '../spec_helper'
import * as subject from '../../src/actions/posts'

describe('posts.js', () => {
  describe('#loadPostDetail', () => {
    const action = subject.loadPostDetail('~my_sweet_token')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    // TODO: This could probably have a matching action.type and action.name
    it('has the expected type constant', () => {
      expect(action.type).to.equal('POST.DETAIL')
    })

    it('returns the expected action', () => {
      expect(action.payload.endpoint.path).to.contain('/posts/~my_sweet_token')
      expect(action.meta.mappingType).to.equal('posts')
      expect(action.meta.updateResult).to.be.false
    })
  })
})
