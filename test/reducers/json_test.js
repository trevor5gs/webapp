/* eslint-disable max-len */
import { expect, stub, isValidResult, json, clearJSON, sinon } from '../spec_helper'
import * as subject from '../../src/reducers/json'
import * as ACTION_TYPES from '../../src/constants/action_types'
import * as MAPPING_TYPES from '../../src/constants/mapping_types'

function stubJSONStore() {
  // add some users
  stub('user', { id: '1', username: 'archer' })
  stub('user', { id: '2', username: 'lana' })
  stub('user', { id: '3', username: 'cyril' })
  stub('user', { id: '4', username: 'pam' })
  // add some posts
  stub('post', { id: '1', token: 'token1', authorId: '1' })
  stub('post', { id: '2', token: 'token2', authorId: '2' })
  stub('post', { id: '3', token: 'token3', authorId: '3' })
  stub('post', { id: '4', token: 'token4', authorId: '4' })
}

describe('json reducer', () => {
  beforeEach(() => {
    stubJSONStore()
  })

  afterEach(() => {
    clearJSON()
  })

  describe('#mergeModel', () => {
    it('does not modify state if there is no id in params', () => {
      subject.methods.mergeModel(json, MAPPING_TYPES.USERS, { username: 'new' })
      expect(json.users['1'].username).to.equal('archer')
    })

    it('modifies state if there is an id in params', () => {
      subject.methods.mergeModel(json, MAPPING_TYPES.USERS, { id: '1', username: 'new' })
      expect(json.users['1'].username).to.equal('new')
    })
  })

  describe('#addModels', () => {
    it('creates a new type on state if it does not exist', () => {
      expect(json.assets).to.be.undefined
      const ids = subject.methods.addModels(json, MAPPING_TYPES.ASSETS, {})
      expect(json.assets).not.to.be.null
      expect(ids).to.be.empty
    })

    it('adds arrays of models', () => {
      expect(json.users['5']).to.be.undefined
      expect(json.users['6']).to.be.undefined
      const data = {}
      data.users = []
      data.users.push(stub('user', { id: '5', username: 'carol' }))
      data.users.push(stub('user', { id: '6', username: 'malory' }))
      const ids = subject.methods.addModels(json, MAPPING_TYPES.USERS, data)
      expect(json.users['5'].username).to.equal('carol')
      expect(json.users['6'].username).to.equal('malory')
      expect(ids).to.deep.equal(['5', '6'])
    })

    it('adds a single model object to the state', () => {
      expect(json.users['123']).to.be.undefined
      const data = {}
      data.users = stub('user', { id: '123', username: 'carol' })
      const ids = subject.methods.addModels(json, MAPPING_TYPES.USERS, data)
      expect(json.users['123'].username).to.equal('carol')
      expect(ids).to.deep.equal(['123'])
    })
  })


  describe('#addNewIdsToResult', () => {
    it('returns the original state if no result', () => {
      const state = { yo: 'yo', mama: 'mama' }
      expect(subject.methods.addNewIdsToResult(state, json)).to.equal(state)
    })

    it('returns the original state if no result.newIds', () => {
      const state = { yo: 'yo', mama: 'mama' }
      json.pages = { sweetpath: { } }
      expect(subject.methods.addNewIdsToResult(state, json)).to.equal(state)
    })

    it('concats the existing result ids to the newIds and deletes the old newIds', () => {
      json.pages = { sweetpath: { newIds: ['1', '2', '3'], ids: ['10', '20', '30'] } }
      subject.setPath('sweetpath')
      subject.methods.addNewIdsToResult({}, json)
      expect(json.pages.sweetpath.newIds).to.be.undefined
      expect(json.pages.sweetpath.ids).to.deep.equal(['1', '2', '3', '10', '20', '30'])
    })
  })

  describe('#parseLinked', () => {
    it('does nothing if linked is not defined', () => {
      expect(subject.methods.parseLinked()).to.be.undefined
    })

    it('parses linked node', () => {
      const linked = {}
      linked.assets = [{ id: 'sup' }, { id: 'dawg' }]
      linked.users = [{ id: 'yo', username: 'yo' }, { id: 'mama', username: 'mama' }]
      expect(json.assets).to.be.undefined
      expect(json.users.yo).to.be.undefined
      expect(json.users.mama).to.be.undefined
      subject.methods.parseLinked(linked, json)
      expect(json.assets.sup).not.to.be.null
      expect(json.assets.dawg).not.to.be.null
      expect(json.users.yo.username).to.equal('yo')
      expect(json.users.mama.username).to.equal('mama')
    })
  })

  describe('#getResult', () => {
    it('returns the filtered result if a #resultFilter is specified', () => {
      const response = { users: [{ id: 'yo', username: 'yo' }, { id: 'mama', username: 'mama' }] }
      const action = { meta: {} }
      action.meta.mappingType = MAPPING_TYPES.USERS
      action.payload = { pagination: '' }
      action.meta.resultFilter = (users) => { return { usernames: users.map((user) => { return user.username }) } }
      const result = subject.methods.getResult(response, json, action)
      expect(result).to.deep.equal({ usernames: ['yo', 'mama'], pagination: '' })
    })

    it('returns the correct result', () => {
      const response = { users: [{ id: 'yo', username: 'yo' }, { id: 'mama', username: 'mama' }] }
      const action = { meta: {} }
      action.meta.mappingType = MAPPING_TYPES.USERS
      action.payload = { pagination: '' }
      const result = subject.methods.getResult(response, json, action)
      expect(isValidResult(result)).to.be.true
      expect(result).to.deep.equal({ ids: ['yo', 'mama'], type: MAPPING_TYPES.USERS, pagination: '' })
    })
  })

  // TODO: test the isInitialLoad piece of this more
  describe('#updateResult', () => {
    afterEach(() => {
      subject.methods.getResult.restore()
    })

    context('action.type === LOAD_STREAM_SUCCESS', () => {
      it('sets the result when it does not exist', () => {
        const result = { pagination: 'sweet' }
        sinon.stub(subject.methods, 'getResult', () => { return result })
        const action = { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: {} }
        action.meta.mappingType = MAPPING_TYPES.USERS
        subject.setPath('sweetness')
        expect(json.pages).to.be.undefined
        subject.methods.updateResult({}, json, action)
        expect(json.pages.sweetness).to.equal(result)
      })

      context('with an existingResult and existingResult.ids[0] !== result.ids[0]', () => {
        it('adds newIds if hasLoadedFirstStream && it is not a nested result && the index is greater than 0', () => {
          const result = { pagination: 'sweet' }
          sinon.stub(subject.methods, 'getResult', () => { return result })
          // json.pages = { sweetness: { ids: ['1', '2'], next: { ids: ['1', '2'] } } }
          // const result = { pagination: 'sweet', ids: ['3'] }
          // sinon.stub(subject.methods, 'getResult', () => { return result })
          // const action = { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: {} }
          // subject.setPath('sweetness')
          // subject.methods.updateResult({}, json, action)
          // expect(json.pages.sweetness).to.deep.equal({ next: { ids: ['1', '2'] }, ...result })
        })

        it('overrides the existing result if the above condition is not met', () => {
          const result = { pagination: 'sweet' }
          sinon.stub(subject.methods, 'getResult', () => { return result })
        })
      })

      it('overlays the result with the existingResult when existingResult and resultKey', () => {
        const result = { pagination: 'sweet' }
        sinon.stub(subject.methods, 'getResult', () => { return result })
      })

      it('resets the result', () => {
        const result = { pagination: 'sweet' }
        sinon.stub(subject.methods, 'getResult', () => { return result })
      })

      it('uses the resultKey to update the storage location within json.pages', () => {
        const result = { pagination: 'sweet' }
        sinon.stub(subject.methods, 'getResult', () => { return result })
        const action = { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { resultKey: 'yo' } }
        action.meta.mappingType = MAPPING_TYPES.USERS
        subject.setPath('sweetness')
        expect(json.pages).to.be.undefined
        subject.methods.updateResult({}, json, action)
        expect(json.pages.sweetness_yo).to.equal(result)
      })
    })

    context('action.type === LOAD_NEXT_CONTENT_SUCCESS', () => {
      it('sets the next property of result when it does not exist', () => {
        json.pages = { sweetness: { pagination: 'cool' } }
        const result = { pagination: 'sweet', ids: ['2', '3', '4'] }
        sinon.stub(subject.methods, 'getResult', () => { return result })
        const action = { type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS, meta: {} }
        subject.setPath('sweetness')
        expect(json.pages.sweetness.next).to.be.undefined
        expect(json.pages.sweetness.pagination).to.equal('cool')
        subject.methods.updateResult({}, json, action)
        expect(json.pages.sweetness.next).to.equal(result)
        expect(json.pages.sweetness.pagination).to.equal('sweet')
      })

      it('updates the next property of result when it exists', () => {
        json.pages = { sweetness: { next: { ids: ['1', '2'] }, pagination: 'cool' } }
        sinon.stub(subject.methods, 'getResult', () => { return { pagination: 'sweet', ids: ['2', '3', '4'] } })
        const action = { type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS, meta: {} }
        subject.setPath('sweetness')
        expect(json.pages.sweetness.next).to.deep.equal({ ids: ['1', '2'] })
        expect(json.pages.sweetness.pagination).to.equal('cool')
        subject.methods.updateResult({}, json, action)
        expect(json.pages.sweetness.next).to.deep.equal({ ids: ['1', '2', '3', '4'] })
        expect(json.pages.sweetness.pagination).to.equal('sweet')
      })

      it('uses the resultKey to update the storage location within json.pages', () => {
        json.pages = { sweetness_yo: { pagination: 'cool' } }
        const result = { pagination: 'sweet', ids: ['2', '3', '4'] }
        sinon.stub(subject.methods, 'getResult', () => { return result })
        const action = { type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS, meta: { resultKey: 'yo' } }
        subject.setPath('sweetness')
        expect(json.pages.sweetness_yo.next).to.be.undefined
        expect(json.pages.sweetness_yo.pagination).to.equal('cool')
        subject.methods.updateResult({}, json, action)
        expect(json.pages.sweetness_yo.next).to.deep.equal({ ids: ['2', '3', '4'], pagination: 'sweet' })
        expect(json.pages.sweetness_yo.pagination).to.equal('sweet')
      })
    })
  })

  describe('#json', () => {
    it('calls #relationshipMethods.updateRelationship if action.type === RELATIONSHIPS.UPDATE_INTERNAL', () => {
      const spy = sinon.stub(subject.relationshipMethods, 'updateRelationship')
      subject.json(json, { type: ACTION_TYPES.RELATIONSHIPS.UPDATE_INTERNAL })
      expect(spy.called).to.be.true
      subject.relationshipMethods.updateRelationship.restore()
    })

    context('with post actions', () => {
      it('calls #postMethods.updatePostLoves if action.type === POST.LOVE_REQUEST', () => {
        const spy = sinon.stub(subject.postMethods, 'updatePostLoves')
        subject.json(json, { type: ACTION_TYPES.POST.LOVE_REQUEST })
        expect(spy.called).to.be.true
        subject.postMethods.updatePostLoves.restore()
      })

      it('calls #postMethods.updatePostLoves if action.type === POST.LOVE_FAILURE', () => {
        const spy = sinon.stub(subject.postMethods, 'updatePostLoves')
        subject.json(json, { type: ACTION_TYPES.POST.LOVE_FAILURE })
        expect(spy.called).to.be.true
        subject.postMethods.updatePostLoves.restore()
      })
    })

    context('with comment actions', () => {
      it('calls #commentMethods.deleteComment if action.type === COMMENT.DELETE_REQUEST', () => {
        const spy = sinon.stub(subject.commentMethods, 'deleteComment')
        subject.json(json, { type: ACTION_TYPES.COMMENT.DELETE_REQUEST })
        expect(spy.called).to.be.true
        subject.commentMethods.deleteComment.restore()
      })

      it('calls #commentMethods.deleteComment if action.type === COMMENT.DELETE_SUCCESS', () => {
        const spy = sinon.stub(subject.commentMethods, 'deleteComment')
        subject.json(json, { type: ACTION_TYPES.COMMENT.DELETE_SUCCESS })
        expect(spy.called).to.be.true
        subject.commentMethods.deleteComment.restore()
      })

      it('calls #commentMethods.deleteComment if action.type === COMMENT.DELETE_FAILURE', () => {
        const spy = sinon.stub(subject.commentMethods, 'deleteComment')
        subject.json(json, { type: ACTION_TYPES.COMMENT.DELETE_FAILURE })
        expect(spy.called).to.be.true
        subject.commentMethods.deleteComment.restore()
      })
    })

    it('returns the original state if the type is not LOAD_NEXT_CONTENT_SUCCESS or LOAD_STREAM_SUCCESS', () => {
      const newState = subject.json(json, {})
      expect(newState).to.equal(json)
    })

    it('returns the original state if there is no response', () => {
      const newState = subject.json(json, { payload: {}, type: ACTION_TYPES.LOAD_STREAM_SUCCESS })
      expect(newState).to.equal(json)
    })

    it('modifies the state if the action.type === LOAD_NEXT_CONTENT_SUCCESS', () => {
      const parseLinkedSpy = sinon.stub(subject.methods, 'parseLinked')
      const updateResultSpy = sinon.stub(subject.methods, 'updateResult')
      const newState = subject.json(json, { payload: { response: true }, type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS })
      expect(parseLinkedSpy.called).to.be.true
      expect(updateResultSpy.called).to.be.true
      expect(newState).not.to.equal(json)
      subject.methods.parseLinked.restore()
      subject.methods.updateResult.restore()
    })
  })
})

