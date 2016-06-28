import { REHYDRATE } from 'redux-persist/constants'
import { expect } from '../../spec_helper'
import * as subject from '../../../src/reducers/authentication'

describe('authentication reducer', () => {
  describe('initial state', () => {
    it('sets up a default initialState', () => {
      expect(
        subject.authentication(undefined, {})
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

      const reducedState = subject.authentication(undefined, action)

      expect(reducedState).to.have.property('refreshTimeoutId', null)
      expect(reducedState).to.have.property('accessToken', '1234')
    })
  })
})
