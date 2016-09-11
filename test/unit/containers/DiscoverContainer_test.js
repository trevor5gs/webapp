import { stubJSONStore } from '../../support/stubs'
import { sortCategories } from '../../../src/selectors/categories'
import {
  loadCategoryPosts,
  loadDiscoverPosts,
  loadDiscoverUsers,
  getCategories,
} from '../../../src/actions/discover'
import {
  generateTabs,
  getStreamAction,
} from '../../../src/containers/DiscoverContainer'

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

  context('#generateTabs', () => {
    it('returns the correct stream action for featured and recommended', () => {
      const json = stubJSONStore()
      const categories = json.categories
      const keys = Object.keys(categories)
      let primary = []
      let secondary = []
      let tertiary = []
      keys.forEach((key) => {
        const category = categories[key]
        switch (category.level) {
          case 'primary':
            primary.push(category)
            break
          case 'secondary':
            secondary.push(category)
            break
          case 'tertiary':
            tertiary.push(category)
            break
          default:
            break
        }
      })
      primary = primary.sort(sortCategories)
      secondary = secondary.sort(sortCategories)
      tertiary = tertiary.sort(sortCategories)
      const tabs = generateTabs(primary, secondary, tertiary)
      expect(tabs[0]).to.have.property('children', 'Featured')
      expect(tabs[0]).to.have.property('to', '/discover')
      expect(tabs[1]).to.have.property('children', 'Trending')
      expect(tabs[1]).to.have.property('to', '/discover/trending')
      expect(tabs[2]).to.have.property('children', 'Recent')
      expect(tabs[2]).to.have.property('to', '/discover/recent')
      expect(tabs[3]).to.have.property('kind', 'divider')
      expect(tabs[4]).to.have.property('children', 'Art')
      expect(tabs[4]).to.have.property('to', '/discover/art')
      expect(tabs[5]).to.have.property('children', 'Design')
      expect(tabs[5]).to.have.property('to', '/discover/design')
      expect(tabs[6]).to.have.property('children', 'Photography')
      expect(tabs[6]).to.have.property('to', '/discover/photography')
      expect(tabs[7]).to.have.property('children', 'Architecture')
      expect(tabs[7]).to.have.property('to', '/discover/architecture')
      expect(tabs[8]).to.have.property('children', 'Interviews')
      expect(tabs[8]).to.have.property('to', '/discover/interviews')
      expect(tabs[9]).to.have.property('children', 'Collage')
      expect(tabs[9]).to.have.property('to', '/discover/collage')
    })
  })
})

