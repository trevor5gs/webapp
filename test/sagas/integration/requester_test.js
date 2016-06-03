import { expect } from '../../spec_helper'
import configureStore from 'redux-mock-store'
import createSagaMiddleware, { END } from 'redux-saga'
import rootSaga from '../../../src/sagas'
import { loadProfile } from '../../../src/actions/profile'
import fetchMock from 'fetch-mock'
import { AUTHENTICATION, PROFILE, REQUESTER } from '../../../src/constants/action_types'

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]

const mockStore = configureStore(middlewares)
describe('requester saga', function () {
  const wickedOld = new Date()
  wickedOld.setFullYear(1989)
  const initialState = {
    authentication: {
      accessToken: 'abc123def',
      expirationDate: wickedOld,
    },
  }

  describe('from the outside in', function () {
    beforeEach(function setUpStore() {
      this.store = mockStore(initialState)
      this.sagaTask = sagaMiddleware.run(rootSaga)
    })

    it('needs to have a test', function () {
      fetchMock.mock(/\/api\/v2\/profile$/, { foo: 'bar' })
      fetchMock.mock(/\/api\/oauth\/refresh$/, initialState.authentication)
      const { store } = this

      store.dispatch(loadProfile())

      store.dispatch(END)
      return this.sagaTask.done.then(function () {
        const actions = store.getActions()
        // extract the action types, since that's all I care about
        // at the moment.  Also filter out the END action that
        // stops the saga
        const actionTypes = actions
              .map(action => action.type)
              .filter(type => type !== END.type)
        expect(actionTypes).to.eq([
          PROFILE.LOAD,
          AUTHENTICATION.REFRESH,
          REQUESTER.PAUSE,
          AUTHENTICATION.REFRESH_REQUEST,
          AUTHENTICATION.REFRESH_SUCCESS,
          REQUESTER.UNPAUSE,
          PROFILE.LOAD_REQUEST,
          PROFILE.LOAD_SUCCESS,
        ])
      })
    })
  })
})
