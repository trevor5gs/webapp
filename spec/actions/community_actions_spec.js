import { expect } from 'chai'
import * as subject from '../../src/actions/community_actions'
import * as TYPE from '../../src/constants/action_types'

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
    expect(action.type).to.equal('LOAD_COMMUNITIES')
    expect(action.promise).to.be.a('function')
    expect(action.payload).to.be.empty
  })

  it('#loadAwesomePeople returns the expected action', () => {
    const action = subject.loadAwesomePeople()
    expect(action.type).to.equal('LOAD_AWESOME_PEOPLE')
    expect(action.promise).to.be.a('function')
    expect(action.payload).to.be.empty
  })

})

