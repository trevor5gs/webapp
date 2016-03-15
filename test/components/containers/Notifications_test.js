import { expect, getRenderedComponent } from '../../spec_helper'
import { Notifications } from '../../../src/containers/notifications/Notifications'
import Session from '../../../src/vendor/session'
import { SESSION_KEYS } from '../../../src/constants/gui_types'

describe('Notifications', () => {
  describe('#render', () => {
    it('clears the session category', () => {
      getRenderedComponent(Notifications, { params: { category: null } })
      expect(Session.getItem(SESSION_KEYS.NOTIFICATIONS_FILTER)).to.be.undefined
    })
    it('sets the session category', () => {
      getRenderedComponent(Notifications, { params: { category: 'mention' } })
      expect(Session.getItem(SESSION_KEYS.NOTIFICATIONS_FILTER)).to.equal('mention')
    })
  })
})
