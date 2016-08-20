import { isFSA, isFSAName } from '../../helpers'
import * as subject from '../../../src/actions/authentication'

describe('authentication actions', () => {
  context('#cancelAuthRefresh', () => {
    const action = subject.cancelAuthRefresh()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.cancelAuthRefresh)).to.be.true
    // })
  })

  context('#clearAuthStore', () => {
    const action = subject.clearAuthStore()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.clearAuthStore)).to.be.true
    // })
  })

  context('#signIn', () => {
    const action = subject.signIn('vader@ello.co', '12345666')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.signIn)).to.be.true
    })

    it('has the correct payload in the action', () => {
      expect(action.payload).to.deep.equal({
        email: 'vader@ello.co',
        password: '12345666',
      })
    })
  })

  context('#getUserCredentials', () => {
    const action = subject.getUserCredentials('vader@ello.co', '12345666')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.getUserCredentials)).to.be.true
    // })

    it('has the correct method in the action', () => {
      expect(action.payload.method).to.equal('POST')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/api/oauth/login')
    })

    it('has the correct body in the action', () => {
      expect(action.payload.body).to.deep.equal({
        email: 'vader@ello.co',
        password: '12345666',
      })
    })

    it('has the correct meta in the action', () => {
      expect(action.meta).to.deep.equal({
        pauseRequester: true,
      })
    })
  })

  context('#logout', () => {
    const action = subject.logout()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.logout)).to.be.true
    })

    it('has the correct method in the action', () => {
      expect(action.payload.method).to.equal('DELETE')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/api/oauth/logout')
    })
  })

  context('#refreshAuthenticationToken', () => {
    const action = subject.refreshAuthenticationToken('22:22')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.refreshAuthenticationToken)).to.be.true
    // })

    it('has the correct method in the action', () => {
      expect(action.payload.method).to.equal('POST')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/api/oauth/refresh')
    })

    it('has the refresh token in the body of the action', () => {
      expect(action.payload.body.refresh_token).to.equal('22:22')
    })

    it('has the pauseRequester in the meta as true', () => {
      expect(action.meta.pauseRequester).to.be.true
    })
  })

  context('#scheduleAuthRefresh', () => {
    const noop = () => {}
    const action = subject.scheduleAuthRefresh('22:22', noop)

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.scheduleAuthRefresh)).to.be.true
    // })

    it('has the refresh token in the action', () => {
      expect(action.payload.refreshToken).to.equal('22:22')
    })

    it('has the timeout in the action', () => {
      expect(action.payload.timeout).to.equal(noop)
    })
  })

  context('#sendForgotPasswordRequest', () => {
    const action = subject.sendForgotPasswordRequest('eddie@ello.co')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.sendForgotPasswordRequest)).to.be.true
    // })

    it('has the correct method in the action', () => {
      expect(action.payload.method).to.equal('POST')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/forgot-password')
    })

    it('has the email in the body of the action', () => {
      expect(action.payload.body.email).to.equal('eddie@ello.co')
    })
  })
})

