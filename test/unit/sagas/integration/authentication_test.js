import createSagaMiddleware from 'redux-saga'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { authentication, initialState } from '../../../../src/reducers/authentication'
import { loginSaga } from '../../../../src/sagas/authentication'
import { signIn } from '../../../../src/actions/authentication'

describe('authentication saga', function () {
  const badInitialState = {
    authentication: {
      a: 1,
      b: 2,
    },
  }
  const email = 'email'
  const password = 'password'

  const reducer = combineReducers({ authentication })

  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    reducer,
    badInitialState,
    applyMiddleware(sagaMiddleware),
  )
  sagaMiddleware.run(loginSaga)

  describe('from the outside in', function () {
    it('needs to have a real test', function () {
      expect(store.getState().authentication).to.include({
        a: 1,
        b: 2,
      })
      store.dispatch(signIn(email, password))
      expect(store.getState().authentication).to.deep.equal(initialState)
    })
  })
})
