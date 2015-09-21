import { expect, isValidResult } from '../spec_helper'
import * as subject from '../../src/reducers/reducers'
import * as ACTION_TYPES from '../../src/constants/action_types'
import * as MAPPING_TYPES from '../../src/constants/mapping_types'

describe('reducers.js', () => {
  describe('#stream', () => {
    it('returns the existing state if nothing is passed in', () => {
      const state = subject.stream()
      expect(state).to.be.empty
    })

    it('returns the previous state if the action type is not LOAD_STREAM', () => {
      let state = subject.stream({}, { type: 'LOAD_STREAM', meta: 'myMeta', payload: 'myPayload', error: 'myError' })
      expect(state.type).to.equal('LOAD_STREAM')
      expect(state.meta).to.equal('myMeta')
      expect(state.payload).to.equal('myPayload')
      expect(state.error).to.equal('myError')
      state = subject.stream(state, { type: 'NOTHING', meta: 'myMeta2', payload: 'myPayload2', error: 'myError2' })
      expect(state.type).to.equal('LOAD_STREAM')
      expect(state.meta).to.equal('myMeta')
      expect(state.payload).to.equal('myPayload')
      expect(state.error).to.equal('myError')
    })

    it('returns the proper state when the action type is LOAD_STREAM', () => {
      const state = subject.stream({}, { type: 'LOAD_STREAM', meta: 'myMeta', payload: 'myPayload', error: 'myError' })
      expect(state.type).to.equal('LOAD_STREAM')
      expect(state.meta).to.equal('myMeta')
      expect(state.payload).to.equal('myPayload')
      expect(state.error).to.equal('myError')
    })
  })

  describe('#staticPage', () => {
    it('returns the existing state if nothing is passed in', () => {
      const state = subject.staticPage()
      expect(state).to.be.empty
    })

    it('returns the previous state if the action type is not STATIC_PAGE', () => {
      let state = subject.staticPage({}, { type: 'STATIC_PAGE', meta: 'myMeta', payload: 'myPayload', error: 'myError' })
      expect(state.type).to.equal('STATIC_PAGE')
      expect(state.meta).to.equal('myMeta')
      expect(state.payload).to.equal('myPayload')
      expect(state.error).to.equal('myError')
      state = subject.staticPage(state, { type: 'NOTHING', meta: 'myMeta2', payload: 'myPayload2', error: 'myError2' })
      expect(state.type).to.equal('STATIC_PAGE')
      expect(state.meta).to.equal('myMeta')
      expect(state.payload).to.equal('myPayload')
      expect(state.error).to.equal('myError')
    })

    it('returns the proper state when the action type is LOAD_STREAM', () => {
      const state = subject.staticPage({}, { type: 'STATIC_PAGE', meta: 'myMeta', payload: 'myPayload', error: 'myError' })
      expect(state.type).to.equal('STATIC_PAGE')
      expect(state.meta).to.equal('myMeta')
      expect(state.payload).to.equal('myPayload')
      expect(state.error).to.equal('myError')
    })
  })

  describe('#json', () => {
    it('stores an array', () => {
      const state = {}
      const user1 = { id: '1' }
      const user2 = { id: '2' }
      const response = { users: [ user1, user2 ] }
      const newState = subject.json(state, { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.USERS }, payload: { response: response } })
      expect(newState.users['1']).to.deep.equal(user1)
      expect(newState.users['2']).to.deep.equal(user2)
      expect(isValidResult(newState.result)).to.be.true
      expect(newState.result.type).to.equal(MAPPING_TYPES.USERS)
      expect(newState.result.ids).to.deep.equal(['1', '2'])
    })

    it('stores an object', () => {
      const state = {}
      const user1 = { id: '1' }
      const response = { users: user1 }
      const newState = subject.json(state, { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.USERS }, payload: { response: response } })
      expect(newState.users['1']).to.deep.equal(user1)
      expect(isValidResult(newState.result)).to.be.true
      expect(newState.result.type).to.equal(MAPPING_TYPES.USERS)
      expect(newState.result.ids).to.deep.equal(['1'])
    })

    it('merges existing properties', () => {
      const state = { users: { '1': { first: 'Foo', last: 'Blah' } } }
      const user1 = { id: '1', first: 'Bar' }
      const response = { users: user1 }
      const newState = subject.json(state, { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.USERS }, payload: { response: response } })
      expect(newState.users['1'].first).to.equal('Bar')
      expect(newState.users['1'].last).to.equal('Blah')
      expect(isValidResult(newState.result)).to.be.true
      expect(newState.result.type).to.equal(MAPPING_TYPES.USERS)
      expect(newState.result.ids).to.deep.equal(['1'])
    })

    it('resets the result object on LOAD_STREAM_REQUEST', () => {
      const state = { result: 'my result', another: 'another' }
      const newState = subject.json(state, { type: ACTION_TYPES.LOAD_STREAM_REQUEST })
      expect(state).not.to.equal(newState)
      expect(newState.result).to.be.empty
    })

    it('returns the original state if not LOAD_STREAM_SUCCESS', () => {
      const state = { result: 'my result', another: 'another' }
      const newState = subject.json(state, { type: 'NOTHING' })
      expect(state).to.equal(newState)
    })

    it('parses linked into the json', () => {
      const state = { result: 'my result' }
      const newState = subject.json(state, { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.USERS }, payload: { response: { linked: { posts: [ { id: '1' }, { id: '2' } ] }, users: { id: '1' } } } })
      expect(newState.posts['1']).to.be.ok
      expect(newState.posts['2']).to.be.ok
      expect(isValidResult(newState.result)).to.be.true
      expect(newState.result.type).to.equal(MAPPING_TYPES.USERS)
      expect(newState.result.ids).to.deep.equal(['1'])
    })

    it('returns the correct result node', () => {
      const state = { result: 'my result' }
      const newState = subject.json(state, { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.POSTS }, payload: { response: { posts: [ { id: '1' }, { id: '2' } ], linked: { users: { id: '1' } } } } })
      expect(isValidResult(newState.result)).to.be.true
      expect(newState.result.type).to.equal(MAPPING_TYPES.POSTS)
      expect(newState.result.ids).to.deep.equal(['1', '2'])
    })

    it('returns the correct result node when a resultFilter is passed', () => {
      const state = { result: 'my result' }
      const newState = subject.json(state, { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { mappingType: MAPPING_TYPES.POSTS, resultFilter: () => {return { foo: 'bar' }} }, payload: { response: { posts: [ { id: '1' }, { id: '2' } ], linked: { users: { id: '1' } } } } })
      expect(newState.result.foo).to.equal('bar')
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
})
