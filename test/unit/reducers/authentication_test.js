import { REHYDRATE } from 'redux-persist/constants'
import { expect } from '../../spec_helper'
import { AUTHENTICATION, PROFILE } from '../../../src/constants/action_types'
import { authentication as reducer } from '../../../src/reducers/authentication'

describe('authentication reducer', () => {
  const initialState = reducer(undefined, {})
  const stubbedResponse = {
    accessToken: '1234',
    createdAt: 1468968055,
    expiresIn: 7200,
    refreshToken: '5678',
    scope: 'public scoped_refresh_token',
    tokenType: 'bearer',
  }

  context('initial state', () => {
    it('sets up a default initialState', () => {
      expect(
        reducer(undefined, {})
      ).to.have.keys(
        'accessToken',
        'createdAt',
        'expirationDate',
        'expiresIn',
        'isLoggedIn',
        'refreshTimeoutId',
        'refreshToken',
        'tokenType'
      )
    })
  })

  context('AUTHENTICATION', () => {
    it('AUTHENTICATION.SCHEDULE_REFRESH updates the refreshTimeoutId', () => {
      const action = {
        type: AUTHENTICATION.SCHEDULE_REFRESH,
        payload: { refreshTimeoutId: '666' },
      }
      const reducedState = reducer(undefined, action)
      expect(reducedState).to.have.property('refreshTimeoutId', '666')
    })

    it('AUTHENTICATION.CANCEL_REFRESH updates the refreshTimeoutId', () => {
      const setAction = {
        type: AUTHENTICATION.SCHEDULE_REFRESH,
        payload: { refreshTimeoutId: '666' },
      }
      const clearAction = { type: AUTHENTICATION.CANCEL_REFRESH }
      const reducedState = reducer(undefined, setAction)
      expect(reducedState).to.have.property('refreshTimeoutId', '666')
      expect(reducer(reducedState, clearAction)).to.have.property('refreshTimeoutId', null)
    })

    it('AUTHENTICATION.CLEAR_STORE resets to initialState', () => {
      const setAction = {
        type: AUTHENTICATION.SCHEDULE_REFRESH,
        payload: { refreshTimeoutId: '666' },
      }
      const clearAction = { type: AUTHENTICATION.CLEAR_STORE }
      const reducedState = reducer(undefined, setAction)
      expect(reducedState).to.have.property('refreshTimeoutId', '666')
      expect(reducer(reducedState, clearAction)).to.deep.equal(initialState)
    })

    it('AUTHENTICATION.LOGOUT_SUCCESS resets to initialState', () => {
      const setAction = {
        type: AUTHENTICATION.SCHEDULE_REFRESH,
        payload: { refreshTimeoutId: '666' },
      }
      const clearAction = { type: AUTHENTICATION.LOGOUT_SUCCESS }
      const reducedState = reducer(undefined, setAction)
      expect(reducedState).to.have.property('refreshTimeoutId', '666')
      expect(reducer(reducedState, clearAction)).to.deep.equal(initialState)
    })

    it('AUTHENTICATION.LOGOUT_FAILURE resets to initialState', () => {
      const setAction = {
        type: AUTHENTICATION.SCHEDULE_REFRESH,
        payload: { refreshTimeoutId: '666' },
      }
      const clearAction = { type: AUTHENTICATION.LOGOUT_FAILURE }
      const reducedState = reducer(undefined, setAction)
      expect(reducedState).to.have.property('refreshTimeoutId', '666')
      expect(reducer(reducedState, clearAction)).to.deep.equal(initialState)
    })

    it('AUTHENTICATION.USER_SUCCESS updates with response items', () => {
      const action = {
        type: AUTHENTICATION.USER_SUCCESS,
        payload: { response: stubbedResponse },
      }
      const reducedState = reducer(undefined, action)
      const newDate = new Date((stubbedResponse.createdAt + stubbedResponse.expiresIn) * 1000)
      expect(reducedState).to.deep.equal({
        ...stubbedResponse,
        isLoggedIn: true,
        expirationDate: newDate,
        refreshTimeoutId: null,
      })
    })

    it('AUTHENTICATION.REFRESH_SUCCESS updates with response items', () => {
      const action = {
        type: AUTHENTICATION.REFRESH_SUCCESS,
        payload: { response: stubbedResponse },
      }
      const reducedState = reducer(undefined, action)
      const newDate = new Date((stubbedResponse.createdAt + stubbedResponse.expiresIn) * 1000)
      expect(reducedState).to.deep.equal({
        ...stubbedResponse,
        isLoggedIn: true,
        expirationDate: newDate,
        refreshTimeoutId: null,
      })
    })
  })

  context('PROFILE', () => {
    it('PROFILE.DELETE_SUCCESS resets to initialState', () => {
      const setAction = {
        type: AUTHENTICATION.SCHEDULE_REFRESH,
        payload: { refreshTimeoutId: '666' },
      }
      const clearAction = { type: PROFILE.DELETE_SUCCESS }
      const reducedState = reducer(undefined, setAction)
      expect(reducedState).to.have.property('refreshTimeoutId', '666')
      expect(reducer(reducedState, clearAction)).to.deep.equal(initialState)
    })

    it('PROFILE.SIGNUP_SUCCESS updates with response items', () => {
      const action = {
        type: PROFILE.SIGNUP_SUCCESS,
        payload: { response: stubbedResponse },
      }
      const reducedState = reducer(undefined, action)
      const newDate = new Date((stubbedResponse.createdAt + stubbedResponse.expiresIn) * 1000)
      expect(reducedState).to.deep.equal({
        ...stubbedResponse,
        isLoggedIn: true,
        expirationDate: newDate,
        refreshTimeoutId: null,
      })
    })
  })

  context('REHYDRATE', () => {
    it('disregards any persisted refreshTimeoutId', () => {
      const action = {
        key: 'authentication',
        type: REHYDRATE,
        payload: {
          authentication: {
            accessToken: '1234',
            refreshTimeoutId: 99,
          },
        },
      }
      const reducedState = reducer(undefined, action)
      expect(reducedState).to.have.property('refreshTimeoutId', null)
      expect(reducedState).to.have.property('accessToken', '1234')
    })
  })
})

