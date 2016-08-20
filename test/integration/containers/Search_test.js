/* eslint-disable prefer-arrow-callback, func-names */
/*
* TODO: Pending this test till we can figure out how to mock history

import React from 'react'
import { get } from 'lodash'
import { LOCATION_CHANGE } from 'react-router-redux'
import { mount } from 'enzyme'
import { updateQueryParams } from '../../../src/helpers/uri_helper'
import { createElloStore } from '../../../src/store'
import Promotion from '../../../src/components/assets/Promotion'
import SearchControl from '../../../src/components/forms/SearchControl'
import StreamContainer from '../../../src/containers/StreamContainer'
import { TabListButtons } from '../../../src/components/tabs/TabList'
import SearchContainer from '../../../src/containers/SearchContainer'

// Since we don't want to deal with the router really
function getMockLocationChangeAction({ pathname = '/search', terms, type }) {
  const query = {}
  if (terms) { query.terms = terms }
  if (type) { query.type = type }
  const search = updateQueryParams(query)
  return {
    type: LOCATION_CHANGE,
    payload: { pathname, query, search },
  }
}

describe('Search', function () {
  context('Basic search scenario', function () {
    const store = createElloStore()
    store.dispatch(getMockLocationChangeAction({ pathname: '/search' }))
    const wrapper = mount(
      <SearchContainer debounceWait={0} />,
      { context: { store } },
    )
    const promotion = wrapper.find(Promotion)
    const searchControl = wrapper.find(SearchControl)
    const tabListButtons = wrapper.find(TabListButtons)
    const streamContainer = wrapper.find(StreamContainer)
    const tab0 = tabListButtons.childAt(0)
    const tab1 = tabListButtons.childAt(1)

    // Fake a @@router/LOCATION_CHANGE action and setting of props
    // Test the expected state changed along the way
    function mockLocationChangeUpdate(location) {
      const action = getMockLocationChangeAction(location)
      store.dispatch(action)
      wrapper.setProps({ location: { ...action.payload } })
      const newState = store.getState()
      const newLocation = {
        pathname: get(newState, 'routing.locationBeforeTransitions.pathname'),
        query: get(newState, 'routing.locationBeforeTransitions.query'),
        search: get(newState, 'routing.locationBeforeTransitions.search'),
      }
      expect(newLocation).to.deep.equal(action.payload)
    }

    it('has all the expected components', function () {
      expect(promotion).to.have.length(1)
      expect(searchControl).to.have.length(1)
      expect(tabListButtons).to.have.length(1)
      expect(streamContainer).to.have.length(1)
      expect(tabListButtons.find('.TabButton')).to.have.length(2)
      expect(tab0.prop('children')).to.equal('Posts')
      expect(tab1.prop('children')).to.equal('People')
      expect(tab0.hasClass('isActive')).to.be.true
      expect(tab1.hasClass('isActive')).to.be.false
    })

    xit('exercises the search interface', function () {
      // Performs a "Posts" search
      searchControl.find('input').simulate('change', { target: { value: 'word' } })
      expect(window.location.search).to.equal('?terms=word')
      mockLocationChangeUpdate({ terms: 'word' })

      // Switches to "User" search
      tab1.simulate('click')
      expect(window.location.search).to.equal('?terms=word&type=users')
      mockLocationChangeUpdate({ type: 'users' })
      expect(tab0.hasClass('isActive')).to.be.false
      expect(tab1.hasClass('isActive')).to.be.true

      // Performs a "User" search
      searchControl.find('input').simulate('change', { target: { value: 'thugs' } })
      expect(window.location.search).to.equal('?terms=thugs&type=users')
      mockLocationChangeUpdate({ terms: 'thugs' })

      // Switches back to "Posts" search
      tab0.simulate('click')
      expect(window.location.search).to.equal('?terms=thugs')
      mockLocationChangeUpdate({ type: 'posts' })
      expect(tab0.hasClass('isActive')).to.be.true
      expect(tab1.hasClass('isActive')).to.be.false
    })

    // Clean it up
    store.close()
  })
})
*/

