import { expect, isFSA, isFSAName, hasStreamMetadata } from '../spec_helper'
import * as subject from '../../src/actions/onboarding'

describe('onboarding.js', () => {
  describe('#loadCommunities', () => {
    const action = subject.loadCommunities()
    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has known action.name and action.type', () => {
      expect(isFSAName(action, subject.loadCommunities)).to.be.true
    })

    it('returns the expected action', () => {
      expect(hasStreamMetadata(action)).to.be.true
      expect(action.payload.vo).to.be.empty
      expect(action.meta.mappingType).to.equal('users')
      expect(action.meta.renderStream.asList).to.be.a('function')
      expect(action.meta.renderStream.asGrid).to.be.a('function')
    })
  })

  describe('#loadAwesomePeople', () => {
    const action = subject.loadAwesomePeople()
    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has known action.name and action.type', () => {
      expect(isFSAName(action, subject.loadAwesomePeople)).to.be.true
    })

    it('returns the expected action', () => {
      expect(hasStreamMetadata(action)).to.be.true
      expect(action.payload.vo).to.be.empty
      expect(action.meta.mappingType).to.equal('users')
      expect(action.meta.renderStream.asList).to.be.a('function')
      expect(action.meta.renderStream.asGrid).to.be.a('function')
    })
  })
})
