import { expect, stub } from '../../spec_helper'
import {
  // StreamComponent as subject,
  mapStateToProps,
} from '../../../src/components/streams/StreamComponent'
import * as MAPPING_TYPES from '../../../src/constants/mapping_types'
import { setLocation } from '../../../src/reducers/gui'

let props
let state

function createPropsForStream(ownProps = {}) {
  const defaultProps = {
    action: {},
    currentUser: stub('user', { id: 'currentUser' }),
    dispatch: () => { /**/ },
    history: {},
    json: {
      pages: {
        what: { ids: [], pagination: {}, type: 'what' },
      },
    },
    isGridMode: true,
    renderObj: { data: [], nestedData: [] },
    result: {
      type: 'posts',
      ids: [],
    },
    stream: { error: false },
  }
  return { ...defaultProps, ...ownProps }
}

function createStateForStream(ownState = {}) {
  const defaultProps = {
    history: {},
    json: {
      pages: {
        '/discover': {
          ids: ['1', '2', '3'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        },
        '/following': {
          ids: ['11', '12', '13'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        },
        '/notifications': {
          ids: ['21', '22', '23'],
          pagination: {},
          type: MAPPING_TYPES.NOTIFICATIONS,
        },
        '/resultKey': {
          ids: ['31', '32', '33'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        },
      },
    },
    gui: {
      history: {
        a1b2c3: {
          key: 'a1b2c3',
          scrolltop: 666,
        },
      },
      isGridMode: false,
      modes: [
        { label: 'discover', mode: 'list', regex: /\/discover|\/explore/ },
        { label: 'following', mode: 'grid', regex: /\/following/ },
      ],
    },
    profile: stub('user', { id: 'currentUser' }),
    routing: {
      location: {
        pathname: 'something',
      },
    },
    stream: { error: false },
  }
  return { ...defaultProps, ...ownState }
}

describe('StreamComponent', () => {
  afterEach(() => {
    props = null
    state = null
  })

  describe('#mapStateToProps', () => {
    context('history', () => {
      it('sets history', () => {
        state = createStateForStream()
        props = createPropsForStream()
        expect(mapStateToProps(state, props).history).to.deep.equal({
          a1b2c3: {
            key: 'a1b2c3',
            scrolltop: 666,
          },
        })
      })
    })

    context('json', () => {
      it('sets json', () => {
        state = createStateForStream()
        props = createPropsForStream()
        expect(mapStateToProps(state, props).json.pages['/following']).to.deep.equal({
          ids: ['11', '12', '13'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        })
      })
    })

    // TODO: This should be moved off to the reducer/gui spec
    context('mode', () => {
      it('sets mode', () => {
        state = createStateForStream({ routing: { location: { pathname: '/discover' } } })
        props = createPropsForStream()
        setLocation({ pathname: '/discover' })
        expect(mapStateToProps(state, props).isGridMode).to.equal(false)
      })
    })

    context('renderObj', () => {
      // need to test
    })

    context('result', () => {
      it('finds a result with a resultKey', () => {
        state = createStateForStream()
        props = createPropsForStream({ action: { meta: { resultKey: '/resultKey' } } })
        expect(mapStateToProps(state, props).result).to.deep.equal({
          ids: ['31', '32', '33'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        })
      })

      it('finds a result from the pathname', () => {
        state = createStateForStream({ routing: { location: { pathname: '/discover' } } })
        props = createPropsForStream()
        expect(mapStateToProps(state, props).result).to.deep.equal({
          ids: ['1', '2', '3'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        })
      })

      it('does not find a result if one does not exist', () => {
        state = createStateForStream()
        props = createPropsForStream()
        expect(mapStateToProps(state, props).result).to.be.undefined
      })
    })

    context('stream', () => {
      it('sets stream', () => {
        state = createStateForStream()
        props = createPropsForStream()
        expect(mapStateToProps(state, props).stream).to.deep.equal({
          error: false,
        })
      })
    })
  })

  // TODO: figure out why this refactor caused the component
  // not to be created with the getRenderedComponent method
  // describe('#render', () => {
  //   describe('StreamComponent hasErrored', () => {
  //     it('renders errors', () => {
  //       const props = { stream: { error: true }, action: { meta: {} } }
  //       const comp = getRenderedComponent(subject, createPropsForStream(props))
  //       console.log('comp', comp)
  //       expect(comp.props.className).to.equal('StreamComponent hasErrored')
  //       expect(comp.type).to.equal('section')
  //       const div = comp.props.children
  //       expect(div)
  //       // const [ img, p1, p2, p3 ] = div.props.children
  //     })
  //   })

  //   describe('StreamComponent isBusy', () => {
  //     it('renders a loader when no result', () => {
  //       const comp = getRenderedComponent(subject, createPropsForStream({ result: null }))
  //       expect(comp.type).to.equal('section')
  //       expect(comp.props.className).to.equal('StreamComponent isBusy')
  //       const div = comp.props.children
  //       expect(div.props.className).to.equal('StreamBusyIndicator')
  //     })

  //     it('renders a loader when no result.type', () => {
  //       const ownProps = { result: { type: null } }
  //       const comp = getRenderedComponent(subject, createPropsForStream(ownProps))
  //       expect(comp.type).to.equal('section')
  //       expect(comp.props.className).to.equal('StreamComponent isBusy')
  //       const div = comp.props.children
  //       expect(div.props.className).to.equal('StreamBusyIndicator')
  //     })

  //     it('renders a loader when no result.ids', () => {
  //       const ownProps = { result: { ids: null } }
  //       const comp = getRenderedComponent(subject, createPropsForStream(ownProps))
  //       expect(comp.type).to.equal('section')
  //       expect(comp.props.className).to.equal('StreamComponent isBusy')
  //       const div = comp.props.children
  //       expect(div.props.className).to.equal('StreamBusyIndicator')
  //     })

  //     it('renders a loader when there is no jsonables', () => {
  //       const comp = getRenderedComponent(subject, createPropsForStream({ meta: true }))
  //       expect(comp.type).to.equal('section')
  //       expect(comp.props.className).to.equal('StreamComponent isBusy')
  //       const div = comp.props.children
  //       expect(div.props.className).to.equal('StreamBusyIndicator')
  //     })

  //     it('renders a loader when there is no meta data', () => {
  //       const props = {
  //         meta: false,
  //         json: {
  //           pages: {
  //             what: {},
  //           },
  //           posts: {
  //             1: { id: '1' },
  //             2: { id: '2' },
  //           },
  //         },
  //         result: {
  //           type: 'posts',
  //           ids: ['1', '2'],
  //         },
  //       }
  //       const comp = getRenderedComponent(subject, createPropsForStream(props))
  //       expect(comp.type).to.equal('section')
  //       expect(comp.props.className).to.equal('StreamComponent isBusy')
  //       const div = comp.props.children
  //       expect(div.props.className).to.equal('StreamBusyIndicator')
  //     })
  //   })

  //   describe('StreamComponent', () => {
  //     it('renders the stream', () => {
  //       const props = createPropsForStream({
  //         action: {
  //           meta: {
  //             renderStream: { asList: () => {/**/}, asGrid: () => {/**/} },
  //             mappingType: MAPPING_TYPES.POSTS,
  //           },
  //         },
  //         json: {
  //           pages: { what: { type: 'posts', ids: ['1'] } },
  //           posts: {
  //             1: { id: '1' },
  //           },
  //         },
  //       })
  //       const renderSpy = sinon.spy(props.action.meta.renderStream, 'asList')
  //       const comp = getRenderedComponent(subject, props)
  //       expect(comp.type).to.equal('section')
  //       expect(comp.props.className).to.equal('StreamComponent')
  //       const expectedProps = {
  //         pages: {
  //           what: {
  //             type: 'posts',
  //             ids: ['1'],
  //           },
  //         },
  //         posts: {
  //           1: {
  //             id: '1',
  //           },
  //         },
  //       }
  //       expect(renderSpy.calledWith(
  //         { data: [{ id: '1' }], nestedData: [] },
  //         expectedProps,
  //         { id: 'currentUser' },
  //         undefined
  //       )).to.be.true
  //     })
  //   })
  // })
})

