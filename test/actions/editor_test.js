import { expect, isFSA, isFSAName } from '../spec_helper'
import * as subject from '../../src/actions/editor'

describe('editor actions', () => {
  context('#setIsCompleterActive', () => {
    const action = subject.setIsCompleterActive({ isActive: true })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.setIsCompleterActive)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys('isCompleterActive')
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.isCompleterActive).to.be.true
    })
  })

  context('#setIsTextToolsActive', () => {
    const action = subject.setIsTextToolsActive({
      isActive: true,
      textToolsStates: { isLinkActive: false, isBoldActive: true, isItalicActive: false },
    })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.setIsTextToolsActive)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys('isTextToolsActive', 'textToolsStates')
    })

    it('sets the appropriate payload for isTextToolsActive', () => {
      expect(action.payload.isTextToolsActive).to.be.true
    })

    it('sets the appropriate payload for textToolsStates', () => {
      expect(action.payload.textToolsStates.isLinkActive).to.be.false
      expect(action.payload.textToolsStates.isBoldActive).to.be.true
      expect(action.payload.textToolsStates.isItalicActive).to.be.false
    })
  })

  context('#setTextToolsCoordinates', () => {
    const action = subject.setTextToolsCoordinates({
      textToolsCoordinates: { top: -867, left: -666 },
    })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.setTextToolsCoordinates)).to.be.true
    })

    it('sets the appropriate payload for textToolsStates', () => {
      expect(action.payload.textToolsCoordinates.top).to.equal(-867)
      expect(action.payload.textToolsCoordinates.left).to.equal(-666)
    })
  })
})

