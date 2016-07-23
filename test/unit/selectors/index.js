import { expect } from '../../spec_helper'
import { stubJSONStore } from '../../stubs'
import {
  selectPagination,
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
})

