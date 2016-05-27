import { expect, isFSA } from '../spec_helper'
import * as subject from '../../src/actions/user'

describe('user actions', () => {
  context('#flagUser', () => {
    const action = subject.flagUser('mk', 'awesome')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the expected type constant', () => {
      expect(action.type).to.equal('USER.FLAG')
    })

    it('has an api endpoint with the username in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/users/~mk')
    })

    it('has an api endpoint with the flag kind in the action', () => {
      expect(action.payload.endpoint.path).to.contain('awesome')
    })
  })
})

