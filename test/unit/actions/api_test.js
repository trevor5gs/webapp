import { expect, isFSA, isFSAName } from '../../spec_helper'
import * as subject from '../../../src/actions/api'

describe('api actions', () => {
  context('#pauseRequester', () => {
    const action = subject.pauseRequester()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.pauseRequester)).to.be.true
    })
  })

  context('#unpauseRequester', () => {
    const action = subject.unpauseRequester()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.unpauseRequester)).to.be.true
    })
  })
})

