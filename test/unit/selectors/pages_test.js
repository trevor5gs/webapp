import { stubJSONStore } from '../../support/stubs'
import {
  selectPages,
  selectAllCategories,
  selectPagesResult,
  selectPage,
} from '../../../src/selectors/pages'

describe('pages selectors', () => {
  let json
  // let params
  // let location
  beforeEach(() => {
    json = stubJSONStore()
    // params = { token: 'paramsToken', type: 'paramsType' }
    // location = { pathname: '/discover' }
  })

  afterEach(() => {
    json = {}
    // params = {}
    // location = {}
  })

  context('#selectPages', () => {
    it('returns the json.pages', () => {
      const state = { json }
      expect(selectPages(state)).to.deep.equal(json.pages)
    })
  })

  context('#selectAllCategories', () => {
    it('returns the json.pages', () => {
      const state = { json }
      expect(selectAllCategories(state)).to.deep.equal(json.pages['all-categories'])
    })
  })

  context('#selectPagesResult', () => {
    it('returns the pages results when the key is supplied', () => {
      const state = { json }
      const props = { action: { meta: { resultKey: '/discover' } } }
      expect(selectPagesResult(state, props)).to.deep.equal(json.pages['/discover'])
    })

    it('returns the pages results when the key is not supplied', () => {
      const state = { json, routing: { location: { pathname: '/discover' } } }
      expect(selectPagesResult(state)).to.deep.equal(json.pages['/discover'])
    })
  })

  context('#selectPage', () => {
    it('returns the page', () => {
      let state = { json, routing: { location: { pathname: '/discover' } }, change: true }
      expect(selectPage(state)).to.deep.equal(json.pages['/discover'])
      state = { ...state, change: false }
      expect(selectPage(state)).to.deep.equal(json.pages['/discover'])
      expect(selectPage.recomputations()).to.equal(1)
    })
  })
})

