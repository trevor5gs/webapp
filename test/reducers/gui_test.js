/* eslint-disable max-len */
import { UPDATE_LOCATION } from 'react-router-redux'
import { expect, // sinon
       } from '../spec_helper'
import * as subject from '../../src/reducers/gui'

describe('gui reducer', () => {
  describe('initial state', () => {
    it('sets up a default initialState', () => {
      expect(
        subject.gui(undefined, {})
      ).to.have.keys('modes', 'currentStream')
    })
  })
  describe('UPDATE_LOCATION', () => {
    it('stores relevant streams to currentStream', () => {
      const action = {
        type: UPDATE_LOCATION,
        payload: {
          pathname: '/discover/trending',
        },
      }

      expect(
        subject.gui(undefined, action)
      ).to.have.property('currentStream', '/discover/trending')
    })
  })
})
