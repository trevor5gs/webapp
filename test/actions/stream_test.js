import { expect, isFSA, isFSAName } from '../spec_helper'
import * as subject from '../../src/actions/stream'
import { postsAsGrid, postsAsList } from '../../src/components/streams/StreamRenderables'
import { postsFromActivities } from '../../src/components/streams/StreamFilters'

describe('stream actions', () => {
  context('#loadFriends', () => {
    const action = subject.loadFriends()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadFriends)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/streams/friend?per_page=25')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('activities')
    })

    it('has asList, asGrid and asZero properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(postsAsList)
      expect(action.meta.renderStream.asGrid).to.equal(postsAsGrid)
      expect(action.meta.renderStream.asZero).to.exist
    })

    it('has the correct resultFilter in the action', () => {
      expect(action.meta.resultFilter).to.equal(postsFromActivities)
    })
  })

  context('#loadNoise', () => {
    const action = subject.loadNoise()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadNoise)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/streams/noise?per_page=25')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('activities')
    })

    it('has asList, asGrid and asZero properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(postsAsList)
      expect(action.meta.renderStream.asGrid).to.equal(postsAsGrid)
      expect(action.meta.renderStream.asZero).to.exist
    })

    it('has the correct resultFilter in the action', () => {
      expect(action.meta.resultFilter).to.equal(postsFromActivities)
    })
  })
})

