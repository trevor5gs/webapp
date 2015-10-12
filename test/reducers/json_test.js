import { expect, isValidResult } from '../spec_helper'
import * as subject from '../../src/reducers'
import * as ACTION_TYPES from '../../src/constants/action_types'
import * as MAPPING_TYPES from '../../src/constants/mapping_types'

describe('json.js', () => {
  it('stores an array', () => {
    const state = {}
    const user1 = { id: '1' }
    const user2 = { id: '2' }
    const response = { users: [ user1, user2 ] }
    const newState = subject.json(
      state,
      { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.USERS }, payload: { response: response } },
      { location: { pathname: 'sweetpath' } },
    )
    expect(newState.users['1']).to.deep.equal(user1)
    expect(newState.users['2']).to.deep.equal(user2)
    expect(isValidResult(newState.pages.sweetpath)).to.be.true
    expect(newState.pages.sweetpath.type).to.equal(MAPPING_TYPES.USERS)
    expect(newState.pages.sweetpath.ids).to.deep.equal(['1', '2'])
  })

  it('stores an object', () => {
    const state = {}
    const user1 = { id: '1' }
    const response = { users: user1 }
    const newState = subject.json(
      state,
      { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.USERS }, payload: { response: response } },
      { location: { pathname: 'sweetpath' } },
    )
    expect(newState.users['1']).to.deep.equal(user1)
    expect(isValidResult(newState.pages.sweetpath)).to.be.true
    expect(newState.pages.sweetpath.type).to.equal(MAPPING_TYPES.USERS)
    expect(newState.pages.sweetpath.ids).to.deep.equal(['1'])
  })

  it('merges existing properties', () => {
    const state = { users: { '1': { first: 'Foo', last: 'Blah' } } }
    const user1 = { id: '1', first: 'Bar' }
    const response = { users: user1 }
    const newState = subject.json(
      state,
      { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.USERS }, payload: { response: response } },
      { location: { pathname: 'sweetpath' } },
    )
    expect(newState.users['1'].first).to.equal('Bar')
    expect(newState.users['1'].last).to.equal('Blah')
    expect(isValidResult(newState.pages.sweetpath)).to.be.true
    expect(newState.pages.sweetpath.type).to.equal(MAPPING_TYPES.USERS)
    expect(newState.pages.sweetpath.ids).to.deep.equal(['1'])
  })

  it('returns the original state if not LOAD_STREAM_SUCCESS', () => {
    const state = { result: 'my result', another: 'another' }
    const newState = subject.json(state, { type: 'NOTHING' })
    expect(state).to.equal(newState)
  })

  it('parses linked into the json', () => {
    const state = { result: 'my result' }
    const newState = subject.json(
      state,
      { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.USERS }, payload: { response: { linked: { posts: [ { id: '1' }, { id: '2' } ] }, users: { id: '1' } } } },
      { location: { pathname: 'sweetpath' } },
    )
    expect(newState.posts['1']).to.be.ok
    expect(newState.posts['2']).to.be.ok
    expect(isValidResult(newState.pages.sweetpath)).to.be.true
    expect(newState.pages.sweetpath.type).to.equal(MAPPING_TYPES.USERS)
    expect(newState.pages.sweetpath.ids).to.deep.equal(['1'])
  })

  it('returns the correct result node', () => {
    const state = { result: 'my result' }
    const newState = subject.json(
      state,
      { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.POSTS }, payload: { response: { posts: [ { id: '1' }, { id: '2' } ], linked: { users: { id: '1' } } } } },
      { location: { pathname: 'sweetpath' } },
    )
    expect(isValidResult(newState.pages.sweetpath)).to.be.true
    expect(newState.pages.sweetpath.type).to.equal(MAPPING_TYPES.POSTS)
    expect(newState.pages.sweetpath.ids).to.deep.equal(['1', '2'])
  })

  it('returns the correct result node when a resultFilter is passed', () => {
    const state = { result: 'my result' }
    const newState = subject.json(
      state,
      { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.POSTS, resultFilter: () => {return { foo: 'bar' }} }, payload: { response: { posts: [ { id: '1' }, { id: '2' } ], linked: { users: { id: '1' } } } } },
      { location: { pathname: 'sweetpath' } },
    )
    expect(newState.pages.sweetpath.foo).to.equal('bar')
  })

  describe('relationship updates', () => {
    it('creates a deep copy of the object', () => {
      const state = { users: { '1': { id: '1' } }}
      const action = {
        type: ACTION_TYPES.RELATIONSHIPS.UPDATE,
        meta: {
          mappingType: MAPPING_TYPES.USERS,
        },
        payload: {
          userId: '1',
        },
      }
      const newState = subject.json(state, action)
      expect(state.users['1']).not.to.equal(newState.users['1'])
    })

    it('adds the relationshipPriority to the user on update', () => {
      const state = { users: { '1': { id: '1' } }}
      const action = {
        type: ACTION_TYPES.RELATIONSHIPS.UPDATE,
        meta: {
          mappingType: MAPPING_TYPES.USERS,
        },
        payload: {
          userId: '1',
          relationshipPriority: 'friend',
        },
      }
      const newState = subject.json(state, action)
      expect(newState.users['1'].relationshipPriority).not.equal('friend')
    })
  })
})
