import { stubJSONStore } from '../../support/stubs'
import { selectPagination } from '../../../src/selectors/pagination'

describe('pagination selectors', () => {
  let json
  let params
  beforeEach(() => {
    json = stubJSONStore()
    params = { token: 'paramsToken', type: 'paramsType' }
  })

  afterEach(() => {
    json = {}
    params = {}
  })

  context('#selectPagination', () => {
    it('returns the pagination object related to the /discover page with memoization', () => {
      const state = { json, routing: { location: { pathname: '/discover' } } }
      const props = { params }
      expect(selectPagination(state, props)).to.deep.equal(json.pages['/discover'].pagination)
      const nextState = { ...state, blah: 1 }
      expect(selectPagination(nextState, props)).to.deep.equal(json.pages['/discover'].pagination)
      expect(selectPagination.recomputations()).to.equal(1)
    })
  })
})

