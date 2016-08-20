import { omnibar as reducer } from '../../../src/reducers/omnibar'
import { AUTHENTICATION, OMNIBAR, PROFILE } from '../../../src/constants/action_types'

describe('omnibar reducer', () => {
  const initialState = reducer(undefined, {})
  const openOmnibarAction = {
    type: OMNIBAR.OPEN,
    payload: {
      classList: 'OmnibarClassName',
      isActive: true,
    },
  }

  const closeOmnibarAction = {
    type: OMNIBAR.CLOSE,
    payload: {
      classList: null,
      isActive: false,
    },
  }

  context('#initialState', () => {
    it('sets up a default initialState', () => {
      expect(reducer(undefined, {})).to.have.keys('classList', 'isActive')
    })
  })

  context('OMNIBAR', () => {
    it('OMNIBAR.OPEN opens the omnibar', () => {
      const result = reducer(reducer, openOmnibarAction)
      expect(result).to.deep.equal(openOmnibarAction.payload)
    })

    it('OMNIBAR.CLOSE closes the omnibar', () => {
      const result = reducer(reducer, closeOmnibarAction)
      expect(result).to.deep.equal(closeOmnibarAction.payload)
    })
  })

  context('AUTHENTICATION', () => {
    it('AUTHENTICATION.LOGOUT resets the initial state', () => {
      const result = reducer(reducer, openOmnibarAction)
      expect(result).to.deep.equal(openOmnibarAction.payload)
      const action = { type: AUTHENTICATION.LOGOUT }
      const nextResult = reducer(result, action)
      expect(nextResult).to.deep.equal(initialState)
    })
  })

  context('PROFILE', () => {
    it('PROFILE.DELETE_SUCCESS resets the initial state', () => {
      const result = reducer(reducer, openOmnibarAction)
      expect(result).to.deep.equal(openOmnibarAction.payload)
      const action = { type: PROFILE.DELETE_SUCCESS }
      const nextResult = reducer(result, action)
      expect(nextResult).to.deep.equal(initialState)
    })
  })
})

