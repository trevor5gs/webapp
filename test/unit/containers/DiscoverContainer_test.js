import {
  loadCategoryPosts,
  loadDiscoverPosts,
  loadDiscoverUsers,
  getCategories,
} from '../../../src/actions/discover'
import { getStreamAction } from '../../../src/containers/DiscoverContainer'

describe('DiscoverContainer', () => {
  context('#getStreamAction', () => {
    it('returns the correct stream action for featured and recommended', () => {
      const realAction = loadCategoryPosts()
      const featuredAction = getStreamAction('featured')
      const recommendedAction = getStreamAction('recommended')
      expect(featuredAction).to.deep.equal(realAction)
      expect(recommendedAction).to.deep.equal(realAction)
    })

    it('returns the correct stream action for recent', () => {
      const realAction = loadDiscoverPosts('recent')
      const testAction = getStreamAction('recent')
      expect(testAction).to.deep.equal(realAction)
    })

    it('returns the correct stream action for trending', () => {
      const realAction = loadDiscoverUsers('trending')
      const testAction = getStreamAction('trending')
      expect(testAction).to.deep.equal(realAction)
    })

    it('returns the correct stream action for all', () => {
      const realAction = getCategories()
      const testAction = getStreamAction('all')
      expect(testAction).to.deep.equal(realAction)
    })
  })
})

