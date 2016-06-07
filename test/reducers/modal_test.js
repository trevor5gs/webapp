import { expect } from '../spec_helper'
// import { LOCATION_CHANGE } from 'react-router-redux'
import { EDITOR, GUI, OMNIBAR, ZEROS } from '../../src/constants/action_types'
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

  context('EDITOR', () => {
    it('EDITOR.SET_IS_COMPLETER_ACTIVE updates isCompleterActive', () => {
      expect(reducer(undefined, {})).to.have.property('isCompleterActive', false)
      const isCompleterActive = true
      const action = { type: EDITOR.SET_IS_COMPLETER_ACTIVE, payload: { isCompleterActive } }
      expect(reducer(reducer, action)).to.have.property('isCompleterActive', true)
    })

    it('EDITOR.SET_IS_TEXT_TOOLS_ACTIVE updates isTextToolsActive', () => {
      expect(reducer(undefined, {})).to.have.property('isTextToolsActive', false)
      const action = {
        type: EDITOR.SET_IS_TEXT_TOOLS_ACTIVE,
        payload: {
          isTextToolsActive: true,
          textToolsStates: { isLinkActive: false, isBoldActive: true, isItalicActive: false },
        },
      }
      const result = reducer(reducer, action)
      expect(result).to.have.property('isTextToolsActive', true)
      expect(result.textToolsStates).to.have.property('isLinkActive', false)
      expect(result.textToolsStates).to.have.property('isBoldActive', true)
      expect(result.textToolsStates).to.have.property('isItalicActive', false)
    })

    it('EDITOR.SET_TEXT_TOOLS_COORDINATES updates textToolsCoordinates', () => {
      const defaults = reducer(undefined, {})
      expect(defaults.textToolsCoordinates).to.have.property('top', -200)
      expect(defaults.textToolsCoordinates).to.have.property('left', -666)
      const action = {
        type: EDITOR.SET_TEXT_TOOLS_COORDINATES,
        payload: {
          textToolsCoordinates: { top: 0, left: 20 },
        },
      }
      const result = reducer(reducer, action)
      expect(result.textToolsCoordinates).to.have.property('top', 0)
      expect(result.textToolsCoordinates).to.have.property('left', 20)
    })
  })

  context('GUI', () => {
    it('GUI.SET_IS_PROFILE_MENU_ACTIVE updates isProfileMenuActive', () => {
      expect(reducer(undefined, {})).to.have.property('isProfileMenuActive', false)
      const isProfileMenuActive = true
      const action = { type: GUI.SET_IS_PROFILE_MENU_ACTIVE, payload: { isProfileMenuActive } }
      expect(reducer(reducer, action)).to.have.property('isProfileMenuActive', true)
    })

    it('GUI.TOGGLE_NOTIFICATIONS updates isNotificationsActive', () => {
      expect(reducer(undefined, {})).to.have.property('isNotificationsActive', false)
      const isNotificationsActive = true
      const action = { type: GUI.TOGGLE_NOTIFICATIONS, payload: { isNotificationsActive } }
      expect(reducer(reducer, action)).to.have.property('isNotificationsActive', true)
    })
  })

  context('OMNIBAR', () => {
    it('OMNIBAR.OPEN sets isOmnibarActive to true', () => {
      expect(reducer(undefined, {})).to.have.property('isOmnibarActive', false)
      const action = { type: OMNIBAR.OPEN, payload: { isActive: true } }
      expect(reducer(reducer, action)).to.have.property('isOmnibarActive', true)
    })

    it('OMNIBAR.CLOSE sets isOmnibarActive to false', () => {
      const testState = { ...reducer(undefined, {}), isOmnibarActive: true }
      expect(testState).to.have.property('isOmnibarActive', true)
      const action = { type: OMNIBAR.CLOSE, payload: { isActive: false } }
      expect(reducer(testState, action)).to.have.property('isOmnibarActive', false)
    })
  })

  context('ZEROS', () => {
    it('ZEROS.SAY_HELLO adds the username to saidHelloTo', () => {
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

