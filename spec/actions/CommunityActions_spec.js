import { expect } from 'chai'
import * as subject from '../../src/actions/CommunityActions'
import * as TYPE from '../../src/constants/ActionTypes'

describe('actions', () => {

  it('#test returns the expected action', () => {
    const action = subject.test('test')
    expect(action.type).to.equal(TYPE.TEST)
    expect(action.message).to.equal('test')
  })

  it('#testAsync returns the expected action', () => {
    const action = subject.testAsync('test')
    expect(action).to.be.a('function')
  })

  it('#loadCommunities returns the expected action', () => {
    const action = subject.loadCommunities()
    expect(action.types[0]).to.equal(TYPE.LOAD_COMMUNITIES_REQUEST)
    expect(action.types[1]).to.equal(TYPE.LOAD_COMMUNITIES_SUCCESS)
    expect(action.types[2]).to.equal(TYPE.LOAD_COMMUNITIES_FAILURE)
    expect(action.shouldCallAPI).to.be.true
    expect(action.callAPI).to.be.a('function')
    expect(action.payload).to.be.empty
  })

})

