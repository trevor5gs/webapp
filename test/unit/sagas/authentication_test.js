import { push } from 'react-router-redux'
import { AUTHENTICATION } from '../../../src/constants/action_types'
import { logoutSaga } from '../../../src/sagas/authentication'

describe('authentication saga', function () {
  describe('*logoutSaga', () => {
    const logoutFn = logoutSaga()

    it('handles logout', () => {
      expect(logoutFn).to.take([
        AUTHENTICATION.LOGOUT_SUCCESS,
        AUTHENTICATION.LOGOUT_FAILURE,
        AUTHENTICATION.REFRESH_FAILURE,
      ])
      expect(document.cookie).to.equal('ello_skip_prerender=false')
      expect(logoutFn).to.put(push('/enter'))
    })
  })
})

