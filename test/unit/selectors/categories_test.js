import { stubJSONStore } from '../../support/stubs'
import {
  selectCategories,
  selectCategoriesAsArray,
  selectCategoryCollection,
  selectCategoryPageTitle,
  sortCategories,
} from '../../../src/selectors/categories'


describe('categories selectors', () => {
  let json
  let params
  let location
  beforeEach(() => {
    json = stubJSONStore()
    params = { token: 'paramsToken', type: 'paramsType' }
    location = { pathname: '/discover' }
  })

  afterEach(() => {
    json = {}
    params = {}
    location = {}
  })

  context('#selectCategoryCollection', () => {
    it('returns the category collection from state', () => {
      const state = { json }
      expect(selectCategoryCollection(state)).to.deep.equal(json.categories)
    })
  })

  context('#selectCategories', () => {
    it('returns the category object with memoization', () => {
      const state = { json }
      const props = { params, location }
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
      const selected = selectCategories(state, props)
      const compare = { primary, secondary, tertiary }
      expect(selected).to.deep.equal(compare)
    })
  })

  context('#selectCategoriesAsArray', () => {
    it('the categories as a concatenated array', () => {
      const state = { json }
      const cats = selectCategories(state)
      const categoryArray = cats.primary.concat(cats.secondary, cats.tertiary)
      expect(selectCategoriesAsArray(state)).to.deep.equal(categoryArray)
    })
  })

  context('#selectCategoryPageTitle', () => {
    it('returns the page title related to the /discover page with memoization', () => {
      const state = { json }
      const props = { params: { token: 'paramsToken', type: 'arktip-x-ello' }, location }
      expect(selectCategoryPageTitle(state, props)).to.equal('Arktip x Ello')
      const nextProps = { ...props, blah: 1 }
      expect(selectCategoryPageTitle(state, nextProps)).to.equal('Arktip x Ello')
      expect(selectCategoryPageTitle.recomputations()).to.equal(1)
      const nextNextProps = { ...nextProps, params: { token: 'paramsToken', type: 'all' } }
      expect(selectCategoryPageTitle(state, nextNextProps)).to.be.null
      const lastProps = { ...nextNextProps, params: { token: 'paramsToken', type: 'recommended' } }
      expect(selectCategoryPageTitle(state, lastProps)).to.equal('Featured')
    })
  })
})

