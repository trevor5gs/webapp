import { expect, isFSA } from '../spec_helper'
import * as subject from '../../src/actions/community_actions'
import * as TYPE from '../../src/constants/action_types'

describe('actions', () => {

  it('#loadCommunities returns the expected action', () => {
    const action = subject.loadCommunities()
    expect(isFSA(action)).to.be.true
    expect(action.type).to.equal('LOAD_COMMUNITIES')
    expect(action.payload.endpoint).to.be.equal('_data/communities.json')
    expect(action.payload.vo).to.be.empty
  })

  it('#loadAwesomePeople returns the expected action', () => {
    const action = subject.loadAwesomePeople()
    expect(isFSA(action)).to.be.true
    expect(action.type).to.equal('LOAD_AWESOME_PEOPLE')
    expect(action.payload.endpoint).to.be.equal('_data/awesome_people.json')
    expect(action.payload.vo).to.be.empty
  })

})

