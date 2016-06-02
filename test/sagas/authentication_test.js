import { expect } from '../spec_helper'
import { AUTHENTICATION } from '../../src/constants/action_types'
import { loginSaga } from '../../src/sagas/authentication'

import {
  clearAuthStore,
  signIn,
  getUserCredentials,
} from '../../src/actions/authentication'

describe('authentication saga', function () {
  const email = 'email'
  const password = 'password'

  describe('the saga itself', function () {
    it('clears the authentication store before logging in', function () {
      const loginAction = signIn(email, password)
      const loginHandler = loginSaga()
      expect(loginHandler).to.take(AUTHENTICATION.SIGN_IN)
      expect(loginHandler.next(loginAction)).to.put(clearAuthStore())

      expect(loginHandler).to.put(getUserCredentials(email, password))
    })
  })
})
