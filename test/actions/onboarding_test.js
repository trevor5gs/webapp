import { expect, isFSA, hasStreamMetadata } from '../spec_helper'
import * as subject from '../../src/actions/onboarding'

describe('onboarding.js', () => {
  describe('#loadCommunities', () => {
    it('returns the expected action', () => {
      const action = subject.loadCommunities()
      expect(isFSA(action)).to.be.true
      expect(hasStreamMetadata(action)).to.be.true
      expect(action.type).to.equal('LOAD_STREAM')
      expect(action.payload.vo).to.be.empty
      expect(action.meta.mappingType).to.equal('users')
      expect(action.meta.renderStream.asList).to.be.a('function')
      expect(action.meta.renderStream.asGrid).to.be.a('function')
    })
  })

  describe('#loadAwesomePeople', () => {
    it('returns the expected action', () => {
      const action = subject.loadAwesomePeople()
      expect(isFSA(action)).to.be.true
      expect(hasStreamMetadata(action)).to.be.true
      expect(action.type).to.equal('LOAD_STREAM')
      expect(action.payload.vo).to.be.empty
      expect(action.meta.mappingType).to.equal('users')
      expect(action.meta.renderStream.asList).to.be.a('function')
      expect(action.meta.renderStream.asGrid).to.be.a('function')
    })
  })
})
