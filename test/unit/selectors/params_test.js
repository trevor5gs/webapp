import { stubJSONStore } from '../../support/stubs'
import {
  selectParamsToken,
  selectParamsType,
  selectParamsUsername,
} from '../../../src/selectors/params'


describe('params selectors', () => {
  let json
  let params
  let location
  beforeEach(() => {
    json = stubJSONStore()
    params = { token: 'paramsToken', type: 'paramsType' }
    location = { pathname: '/discover' }
  })

  afterEach(() => {
    json = {}
    params = {}
    location = {}
  })

  context('#selectParamsToken', () => {
    it('returns the params token as lower case', () => {
      const state = { json }
      const props = { params, location }
      expect(selectParamsToken(state, props)).to.equal('paramstoken')
    })
  })

  context('#selectParamsType', () => {
    it('returns the params type', () => {
      const state = { json }
      const props = { params, location }
      expect(selectParamsType(state, props)).to.equal('paramsType')
    })
  })

  context('#selectParamsUsername', () => {
    const state = { json }
    const props = { params, location }

    it('returns the params username as undefined', () => {
      expect(selectParamsUsername(state, props)).to.be.undefined
    })

    it('returns the correct params username', () => {
      const nextProps = { params: { ...params, username: 'username' }, location }
      expect(selectParamsUsername(state, nextProps)).to.equal('username')
    })
  })
})

