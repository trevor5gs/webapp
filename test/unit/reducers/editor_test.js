import { REHYDRATE } from 'redux-persist/constants'
import { expect, sinon } from '../../spec_helper'
import * as subject from '../../../src/reducers/editor'
import { AUTHENTICATION, EDITOR, PROFILE } from '../../../src/constants/action_types'

describe('editor reducer', () => {
  describe('@initialState', () => {
    it('should have the correct default properties', () => {
      expect(subject.initialState.completions).to.be.empty
    })
  })

  describe('#editor', () => {
    let action = null
    let state = null

    context('with an editorId', () => {
      it('calls #getEditorObject', () => {
        const spy = sinon.stub(subject.editorMethods, 'getEditorObject')
        action = { payload: { editorId: 666 } }
        state = subject.editor({}, action)
        expect(spy.calledWith(undefined, action)).to.be.true
        expect(state['666']).not.to.be.null
        spy.restore()
      })

      context('action.type === EDITOR.INITIALIZE', () => {
        it('defaults shouldPersist to false', () => {
          action = { payload: { editorId: 666 }, type: EDITOR.INITIALIZE }
          state = subject.editor({}, action)
          expect(state['666'].shouldPersist).to.be.false
        })

        it('sets shouldPersist to true', () => {
          action = { payload: { editorId: 666, shouldPersist: true }, type: EDITOR.INITIALIZE }
          state = subject.editor({}, action)
          expect(state['666'].shouldPersist).to.be.true
        })
      })

      context('editor exists', () => {
        it('calls #addHasContent, #addHasMedia, #addHasMention, and #addIsLoading', () => {
          action = { payload: { editorId: 666 } }
          const contentSpy = sinon.stub(subject.editorMethods, 'addHasContent')
          const mediaSpy = sinon.stub(subject.editorMethods, 'addHasMedia')
          const mentionSpy = sinon.stub(subject.editorMethods, 'addHasMention')
          const loadingSpy = sinon.stub(subject.editorMethods, 'addIsLoading')
          state = subject.editor({}, action)
          expect(contentSpy.called).to.be.true
          expect(mediaSpy.called).to.be.true
          expect(mentionSpy.called).to.be.true
          expect(loadingSpy.called).to.be.true
        })
      })
    })

    context('without an editorId', () => {
      it('returns the initialState with AUTHENTICATION.LOGOUT', () => {
        action = { type: AUTHENTICATION.LOGOUT }
        state = subject.editor({}, action)
        expect(state).to.deep.equal(subject.initialState)
      })

      it('returns the initialState with PROFILE.DELETE_SUCCESS', () => {
        action = { type: PROFILE.DELETE_SUCCESS }
        state = subject.editor({}, action)
        expect(state).to.deep.equal(subject.initialState)
      })

      it('clears out completions with EDITOR.CLEAR_AUTO_COMPLETERS', () => {
        action = { type: EDITOR.CLEAR_AUTO_COMPLETERS }
        state = subject.editor({ completions: ['1', '2', '3'] }, action)
        expect(state.completions).to.be.undefined
      })

      it('calls #addCompletions with EDITOR.EMOJI_COMPLETER_SUCCESS', () => {
        const spy = sinon.stub(subject.editorMethods, 'addCompletions')
        action = { type: EDITOR.EMOJI_COMPLETER_SUCCESS }
        state = subject.editor({ completions: ['1', '2', '3'] }, action)
        expect(spy.called).to.be.true
        spy.restore()
      })

      it('calls #addCompletions with EDITOR.USER_COMPLETER_SUCCESS', () => {
        const spy = sinon.stub(subject.editorMethods, 'addCompletions')
        action = { type: EDITOR.USER_COMPLETER_SUCCESS }
        state = subject.editor({ completions: ['1', '2', '3'] }, action)
        expect(spy.called).to.be.true
        spy.restore()
      })

      it('calls #rehydrateEditors with REHYDRATE', () => {
        const spy = sinon.stub(subject.editorMethods, 'rehydrateEditors')
        action = { type: REHYDRATE, payload: { editor: 'yo' } }
        state = subject.editor({}, action)
        expect(spy.calledWith('yo')).to.be.true
        spy.restore()
      })

      it('returns the original state if action.type is not supported', () => {
        const newState = { prop1: '1', prop2: '2' }
        state = subject.editor(newState, {})
        expect(state).to.equal(newState)
      })
    })
  })
})

