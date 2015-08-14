import { expect, isFSA, hasStreamMetadata } from '../spec_helper'
import * as subject from '../../src/actions/community_actions'
import * as TYPE from '../../src/constants/action_types'

describe('actions', () => {

  it('#loadChannels returns the expected action', () => {
    const action = subject.loadChannels()
    expect(isFSA(action)).to.be.true
    expect(hasStreamMetadata(action)).to.be.true
    expect(action.type).to.equal('LOAD_STREAM')
    expect(action.payload.endpoint).to.be.equal('/_data/channels.json')
    expect(action.payload.vo).to.be.empty
    expect(action.meta.mappingType).to.equal('users')
    expect(action.meta.renderStream).to.be.a('function')
  })

  it('#loadAwesomePeople returns the expected action', () => {
    const action = subject.loadAwesomePeople()
    expect(isFSA(action)).to.be.true
    expect(hasStreamMetadata(action)).to.be.true
    expect(action.type).to.equal('LOAD_STREAM')
    expect(action.payload.endpoint).to.be.equal('/_data/awesome_people.json')
    expect(action.payload.vo).to.be.empty
    expect(action.meta.mappingType).to.equal('users')
    expect(action.meta.renderStream).to.be.a('function')
  })

})

