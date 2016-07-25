import { expect } from '../../spec_helper'
import { stubJSONStore } from '../../stubs'
import {
  selectCategories,
  selectPagination,
  sortCategories,
} from '../../../src/selectors'

describe('selectors', () => {
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

  context('#selectPagination', () => {
    it('returns the pagination object related to the /discover page with memoization', () => {
      const state = { json }
      const props = { params, location }
      expect(selectPagination(state, props)).to.deep.equal(json.pages['/discover'].pagination)
      const nextState = { ...state, blah: 1 }
      expect(selectPagination(nextState, props)).to.deep.equal(json.pages['/discover'].pagination)
      expect(selectPagination.recomputations()).to.equal(1)
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
      const compare = { primary, secondary, tertiary, pageTitle: 'Featured' }
      expect(selected).to.deep.equal(compare)
    })
  })
})

