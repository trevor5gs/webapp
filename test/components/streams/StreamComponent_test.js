import { expect, getRenderedComponent, sinon } from '../../spec_helper'
import { StreamComponent as subject } from '../../../src/components/streams/StreamComponent'
import * as MAPPING_TYPES from '../../../src/constants/mapping_types'

function createPropsForStream(props = {}) {
  const defaultProps = { stream: { error: false }, action: {}, dispatch: () => {}, json: { pages: { what: {} } }, result: { type: 'posts', ids: [] }, router: { location: { pathname: 'what' } }, currentUser: { id: 'currentUser' } }
  return { ...defaultProps, ...props }
}

describe('StreamComponent', () => {
  describe('#render', () => {
    describe('StreamComponent hasErrored', () => {
      it('renders errors', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ stream: { error: true }, action: { meta: {} } }))
        expect(comp.props.className).to.equal('StreamComponent hasErrored')
        expect(comp.type).to.equal('section')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamErrorMessage')
        // const [ img, p1, p2, p3 ] = div.props.children
      })
    })

    describe('StreamComponent isBusy', () => {
      it('renders a loader when no result', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ result: null }))
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent isBusy')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamBusyIndicator')
      })

      it('renders a loader when no result.type', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ result: { type: null } }))
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent isBusy')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamBusyIndicator')
      })

      it('renders a loader when no result.ids', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ result: { ids: null } }))
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent isBusy')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamBusyIndicator')
      })

      it('renders a loader when there is no jsonables', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ meta: true }))
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent isBusy')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamBusyIndicator')
      })

      it('renders a loader when there is no meta data', () => {
        const comp = getRenderedComponent(subject, createPropsForStream({ meta: false, json: { pages: { what: {} }, posts: { '1': { id: '1' }, '2': { id: '2' } } }, result: { type: 'posts', ids: ['1', '2'] } }))
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent isBusy')
        const div = comp.props.children
        expect(div.props.className).to.equal('StreamBusyIndicator')
      })
    })

    describe('StreamComponent', () => {
      it('renders the stream', () => {
        const props = createPropsForStream({
          action: {
            meta: {
              defaultMode: 'list',
              renderStream: { asList: () => {}, asGrid: () => {} },
              mappingType: MAPPING_TYPES.POSTS,
            },
          },
          json: {
            pages: { what: { type: 'posts', ids: ['1'] } },
            posts: {
              '1': { id: '1' },
            },
          },
        })
        const renderSpy = sinon.spy(props.action.meta.renderStream, 'asList')
        const comp = getRenderedComponent(subject, props)
        expect(comp.type).to.equal('section')
        expect(comp.props.className).to.equal('StreamComponent')
        expect(renderSpy.calledWith({ data: [{ id: '1' }], nestedData: [] }, { pages: { what: { type: 'posts', ids: ['1'] } }, posts: { '1': { id: '1' } } }, { id: 'currentUser' }, undefined)).to.be.true
      })
    })
  })
})

