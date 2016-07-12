import { expect } from '../../spec_helper'
import { modal as reducer } from '../../../src/reducers/modal'

describe('modal reducer', () => {
  context('#initialState', () => {
    it('sets up a default initialState', () => {
      expect(
        reducer(undefined, {})
      ).to.have.keys(
        'classList',
        'component',
        'isActive',
        'kind',
      )
    })
  })
})

