import { stub } from '../../support/stubs'
import {
  selectPropsUser,
  selectPropsUserId,
  selectUsers,
  selectUser,
  selectUserFromPropsUserId,
  selectUserFromUsername,
  selectRelationshipPriority,
} from '../../../src/selectors/user'


describe('post selectors', () => {
  let stateUser
  let propsUser
  beforeEach(() => {
    stateUser = stub('user', { id: 'stateUser' })
    propsUser = stub('user', { id: 'propsUser' })
  })

  afterEach(() => {
    stateUser = {}
    propsUser = {}
  })

  context('#selectPropsUser', () => {
    it('returns the correct props post', () => {
      const state = { json: { users: stateUser } }
      const props = { user: propsUser }
      expect(selectPropsUser(state, props)).to.deep.equal(propsUser)
    })
  })

  context('#selectPropsUserId', () => {
    it('returns the correct props user id', () => {
      const state = { json: { users: stateUser } }
      const props = { user: propsUser }
      expect(selectPropsUserId(state, props)).to.equal('propsUser')
    })
  })

  context('#selectUsers', () => {
    it('returns the correct users from json', () => {
      const state = { json: { users: stateUser } }
      const props = { user: propsUser }
      expect(selectUsers(state, props)).to.deep.equal(stateUser)
    })
  })

  context('#selectUser', () => {
    it('returns the correct user from json with a props', () => {
      const state = { json: { users: { stateUser: { ...stateUser } } } }
      const props = { user: { id: 'stateUser' } }
      expect(selectUser(state, props)).to.deep.equal(stateUser)
    })
  })

  context('#selectUserFromPropsUserId', () => {
    it('returns the user from json', () => {
      const usr = stub('user')
      const state = { json: { users: { 1: { ...usr } } } }
      const props = { user: { id: '1' } }
      expect(selectUserFromPropsUserId(state, props)).to.deep.equal(usr)
      const nextState = { ...state, change: 1 }
      expect(selectUserFromPropsUserId(nextState, props)).to.deep.equal(usr)
      expect(selectUserFromPropsUserId.recomputations()).to.equal(1)
    })
  })

  context('#selectUserFromUsername', () => {
    it('returns the user from json', () => {
      const usr = stub('user', { username: 'mansfield' })
      const state = { json: { users: { 1: { ...usr } } } }
      const props = { params: { username: 'mansfield' } }
      expect(selectUserFromUsername(state, props)).to.deep.equal(usr)
    })
  })

  context('#selectRelationshipPriority', () => {
    it('returns the user priority from json', () => {
      const state = { json: { users: { 1: { ...stateUser, relationshipPriority: 'friend' } } } }
      const props = { user: { id: '1' } }
      expect(selectRelationshipPriority(state, props)).to.equal('friend')
    })
  })
})
