import {
  clearJSON,
  expect,
  json,
  sinon,
  stub,
} from '../../spec_helper'
import subject from '../../../src/reducers/experience_updates/relationships'
import * as MAPPING_TYPES from '../../../src/constants/mapping_types'
import { RELATIONSHIP_PRIORITY } from '../../../src/constants/relationship_types'

function stubJSONStore() {
  // add some users
  stub('user', { id: '1', username: 'archer' })
  stub('user', { id: '2', username: 'lana', relationshipPriority: 'friend' })
  stub('user', { id: '3', username: 'cyril' })
  stub('user', { id: '4', username: 'pam' })
  // add some posts
  stub('post', { id: '1', token: 'token1', authorId: '1' })
  stub('post', { id: '2', token: 'token2', authorId: '2' })
  stub('post', { id: '3', token: 'token3', authorId: '3' })
  stub('post', { id: '4', token: 'token4', authorId: '4' })
  // add some comments
  stub('comment', { id: '1', authorId: '1' })
  stub('comment', { id: '2', authorId: '2' })
  stub('comment', { id: '3', authorId: '3' })
  stub('comment', { id: '4', authorId: '4' })
}

function createRelationshipTest(priority) {
  expect(json.users['1'].relationshipPriority).to.be.null
  expect(json.users['1'].followersCount).to.equal(0)
  const action = {}
  action.payload = { userId: '1', priority }
  action.meta = { mappingType: MAPPING_TYPES.USERS }
  subject.updateFollowersCountAndPriority(json, action)
  expect(json.users['1'].relationshipPriority).to.equal(priority)
  expect(json.users['1'].followersCount).to.equal(1)
}

function destroyRelationshipTest(priority) {
  expect(json.users['2'].relationshipPriority).to.equal(RELATIONSHIP_PRIORITY.FRIEND)
  expect(json.users['2'].followersCount).to.equal(0)
  const action = {}
  action.payload = { userId: '2', priority }
  action.meta = { mappingType: MAPPING_TYPES.USERS }
  subject.updateFollowersCountAndPriority(json, action)
  expect(json.users['2'].relationshipPriority).to.equal(priority)
  expect(json.users['2'].followersCount).to.equal(-1)
}

describe('relationships experience update', () => {
  beforeEach(() => {
    stubJSONStore()
  })

  afterEach(() => {
    clearJSON()
  })

  describe('#updateFollowersCountAndPriority', () => {
    it('updates relationship properly with friend or noise', () => {
      const relationships = [RELATIONSHIP_PRIORITY.FRIEND, RELATIONSHIP_PRIORITY.NOISE]
      for (const priority of relationships) {
        stubJSONStore()
        createRelationshipTest(priority)
        clearJSON()
      }
    })

    it('updates relationship to inactive, self, mute, block, or none', () => {
      const relationships = [
        RELATIONSHIP_PRIORITY.INACTIVE,
        RELATIONSHIP_PRIORITY.SELF,
        RELATIONSHIP_PRIORITY.MUTE,
        RELATIONSHIP_PRIORITY.BLOCK,
        RELATIONSHIP_PRIORITY.NONE,
      ]
      for (const priority of relationships) {
        stubJSONStore()
        destroyRelationshipTest(priority)
        clearJSON()
      }
    })
  })

  describe('#removeItemsForAuthor', () => {
    it('removes posts from the store', () => {
      expect(json.posts['3']).not.to.be.undefined
      subject.removeItemsForAuthor(json, MAPPING_TYPES.POSTS, '3')
      expect(json.posts['3']).to.be.undefined
    })

    it('removes comments from the store', () => {
      expect(json.comments['3']).not.to.be.undefined
      subject.removeItemsForAuthor(json, MAPPING_TYPES.COMMENTS, '3')
      expect(json.comments['3']).to.be.undefined
    })
  })

  describe('#updateRelationship', () => {
    it('calls #updateFollowersCountAndPriority', () => {
      const spy = sinon.stub(subject, 'updateFollowersCountAndPriority')
      const action = {
        payload: {
          userId: '10',
          priority: RELATIONSHIP_PRIORITY.FRIEND,
        },
      }
      subject.updateRelationship(json, action)
      expect(spy.called).to.be.true
    })

    context('when the priority === RELATIONSHIP_PRIORITY.BLOCK', () => {
      let action = {}
      beforeEach(() => {
        // create action
        action = {
          payload: {
            userId: '3',
            priority: RELATIONSHIP_PRIORITY.BLOCK,
          },
        }
      })

      it('deletes the blocked user from the user store', () => {
        expect(json.users['3']).not.to.be.null
        subject.updateRelationship(json, action)
        expect(json.users['3']).to.be.undefined
      })

      it('calls #removeItemsForAuthor with posts and userId', () => {
        const spy = sinon.stub(subject, 'removeItemsForAuthor')
        subject.updateRelationship(json, action)
        expect(spy.calledWith(json, 'posts', '3')).to.be.true
        expect(spy.calledWith(json, 'comments', '3')).to.be.true
      })
    })
  })
})

