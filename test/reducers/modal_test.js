import { expect } from '../spec_helper'
// import { LOCATION_CHANGE } from 'react-router-redux'
import { OMNIBAR, ZEROS } from '../../src/constants/action_types'
import { modal as reducer } from '../../src/reducers/modal'

describe('modal reducer', () => {
  context('#initialState', () => {
    it('sets up a default initialState', () => {
      expect(
        reducer(undefined, {})
      ).to.have.keys(
        'classList',
        'component',
        'isActive',
        'isCompleterActive',
        'isNotificationsActive',
        'isOmnibarActive',
        'isProfileMenuActive',
        'isTextToolsActive',
        'kind',
        'saidHelloTo',
        'textToolsCoordinates',
        'textToolsStates',
      )
    })
  })

  context('GUI', () => {
    it('GUI.SET_IS_PROFILE_MENU_ACTIVE updates isProfileMenuActive', () => {
      expect(reducer(undefined, {})).to.have.property('isProfileMenuActive', false)
      const isProfileMenuActive = true
      const action = { type: GUI.SET_IS_PROFILE_MENU_ACTIVE, payload: { isProfileMenuActive } }
      expect(reducer(reducer, action)).to.have.property('isProfileMenuActive', true)
    })
  })

  context('OMNIBAR', () => {
    it('OPEN sets isOmnibarActive to true', () => {
      expect(reducer(undefined, {})).to.have.property('isOmnibarActive', false)
      const action = { type: OMNIBAR.OPEN, payload: { isActive: true } }
      expect(reducer(reducer, action)).to.have.property('isOmnibarActive', true)
    })

    it('CLOSE sets isOmnibarActive to false', () => {
      const testState = { ...reducer(undefined, {}), isOmnibarActive: true }
      expect(testState).to.have.property('isOmnibarActive', true)
      const action = { type: OMNIBAR.CLOSE, payload: { isActive: false } }
      expect(reducer(testState, action)).to.have.property('isOmnibarActive', false)
    })
  })

  context('ZEROS', () => {
    it('SAY_HELLO adds the username to saidHelloTo', () => {
      const firstState = reducer(undefined, {})
      expect(firstState).to.have.property('saidHelloTo')
      expect(firstState.saidHelloTo.length).to.equal(0)
      const action = { type: ZEROS.SAY_HELLO, payload: { username: 'timmy' } }
      const nextState = reducer(firstState, action)
      expect(nextState.saidHelloTo).to.deep.equal(['timmy'])
      const lastAction = { type: ZEROS.SAY_HELLO, payload: { username: 'tommy' } }
      const lastState = reducer(nextState, lastAction)
      expect(lastState.saidHelloTo).to.deep.equal(['timmy', 'tommy'])
    })
  })
})

