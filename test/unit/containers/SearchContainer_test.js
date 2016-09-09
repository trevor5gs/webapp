import { getStreamAction } from '../../../src/containers/SearchContainer'

describe('SearchContainer', () => {
  context('#getStreamAction', () => {
    it('returns the correct stream action for user search', () => {
      const action = getStreamAction('@mansfield', 'users')
      expect(action.payload.endpoint.path).to.contain('/users?per_page=25&terms=%40mansfield')
    })

    it('returns the correct stream action for post search', () => {
      const action = getStreamAction('danger', 'posts')
      expect(action.payload.endpoint.path).to.contain('/posts?per_page=25&terms=danger')
    })
  })
})

