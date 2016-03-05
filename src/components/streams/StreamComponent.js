import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import scrollTop from '../../vendor/scrollTop'
import classNames from 'classnames'
import _ from 'lodash'
import { runningFetches } from '../../middleware/requester'
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { findBy } from '../base/json_helper'
import { addScrollObject, removeScrollObject } from '../interface/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../interface/ResizeComponent'
import { ElloMark } from '../interface/ElloIcons'
import { Paginator, emptyPagination } from '../streams/Paginator'
import { findLayoutMode } from '../../reducers/gui'
import { ZeroState } from '../zeros/Zeros'
import { ErrorState4xx } from '../errors/Errors'

export class StreamComponent extends Component {

  static propTypes = {
    action: PropTypes.object,
    children: PropTypes.any,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    initModel: PropTypes.object,
    json: PropTypes.object.isRequired,
    paginatorText: PropTypes.string,
    renderObj: PropTypes.shape({
      data: PropTypes.array.isRequired,
      nestedData: PropTypes.array.isRequired,
    }).isRequired,
    result: PropTypes.shape({
      next: PropTypes.shape({
        ids: PropTypes.array,
        pagination: PropTypes.shape({
          next: PropTypes.string,
          totalCount: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
          ]),
          totalPages: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
          ]),
          totalPagesRemaining: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
          ]),
        }),
        type: PropTypes.string,
      }),
      ids: PropTypes.array,
      pagination: PropTypes.shape({
        next: PropTypes.string,
        totalCount: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
        totalPages: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
        totalPagesRemaining: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
      }),
      type: PropTypes.string,
    }),
    stream: PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    paginatorText: 'Loading',
  };

  componentWillMount() {
    const { action, dispatch } = this.props
    if (action) { dispatch(action) }

    let browserListen
    if (browserHistory) {
      browserListen = browserHistory.listen
    } else {
      browserListen = (listener) => {
        listener({ key: 'testing' })
        return () => null
      }
    }
    const unlisten = browserListen(location => {
      this.state = { action, locationKey: location.key }
    })
    unlisten()

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
    this.setDebouncedScroll = _.debounce(this.setDebouncedScroll, 300)
  }

  componentDidMount() {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
    addScrollObject(this)
    addResizeObject(this)
  }

  componentWillReceiveProps(nextProps) {
    const { stream } = nextProps
    const { action } = this.state
    if (!action) { return null }

    if (stream.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
      this.setState({ hidePaginator: true })
    }
  }

  // this prevents nested stream components from clobbering parents
  shouldComponentUpdate(prevProps) {
    const { mode, renderObj, stream } = this.props
    const { mode: prevMode, renderObj: prevRenderObj, stream: prevStream } = prevProps
    if (mode === prevMode && _.isEqual(renderObj, prevRenderObj) && _.isEqual(stream, prevStream)) {
      return false
    } else if (stream.meta &&
               stream.meta.updateKey &&
               !stream.payload.endpoint.path.match(stream.meta.updateKey)) {
      return false
    }
    return true
  }

  componentDidUpdate(prevProps) {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
    const { history, stream } = this.props
    if (stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS &&
      prevProps.stream.type !== ACTION_TYPES.LOAD_STREAM_SUCCESS) {
      const historyKey = history[this.state.locationKey] || {}
      const scrollTopValue = historyKey.scrollTop
      if (scrollTopValue) {
        window.scrollTo(0, scrollTopValue)
      }
    }
  }

  componentWillUnmount() {
    if (window.embetter) {
      window.embetter.stopPlayers()
    }
    removeScrollObject(this)
    removeResizeObject(this)

    this.setDebouncedScroll = () => null
    this.setScroll()
  }

  onScroll() {
    this.setDebouncedScroll()
  }

  onScrollBottom() {
    this.loadPage('next', true)
  }

  onResize(resizeProps) {
    this.setState(resizeProps)
  }

  onLoadNextPage = () => {
    this.loadPage('next')
  };

  setAction(action) {
    this.setState({ action })
    this.props.dispatch(action)
  }

  setDebouncedScroll() {
    this.setScroll()
  }

  setScroll() {
    this.props.dispatch({
      type: ACTION_TYPES.GUI.SET_SCROLL,
      payload: {
        key: this.state.locationKey,
        scrollTop: scrollTop(window),
      },
    })
  }

  loadPage(rel, scrolled = false) {
    const { dispatch, result } = this.props
    if (!result) { return }
    const { action } = this.state
    const { meta } = action
    if (scrolled && meta && meta.resultKey) { return }
    const { pagination } = result
    if (!action.payload.endpoint ||
        !pagination[rel] ||
        parseInt(pagination.totalPagesRemaining, 10) === 0 ||
        !action) { return }
    if (runningFetches[pagination[rel]]) { return }
    this.setState({ hidePaginator: false })
    const infiniteAction = {
      ...action,
      type: ACTION_TYPES.LOAD_NEXT_CONTENT,
      payload: {
        endpoint: { path: pagination[rel] },
      },
      meta: {
        mappingType: action.payload.endpoint.pagingPath || meta.mappingType,
        resultFilter: meta.resultFilter,
        resultKey: meta.resultKey,
      },
    }
    dispatch(infiniteAction)
  }

  findModel(json, initModel) {
    if (!initModel || !initModel.findObj || !initModel.collection) {
      return null
    }
    return findBy(initModel.findObj, initModel.collection, json)
  }

  renderError() {
    const { action } = this.props
    const { meta } = action
    return (
      <section className="StreamComponent hasErrored">
        { meta && meta.renderStream && meta.renderStream.asError ?
          meta.renderStream.asError :
          <ErrorState4xx/>
        }
      </section>
    )
  }

  renderLoading() {
    return (
      <section className="StreamComponent isBusy">
        <div className="StreamBusyIndicator">
          <ElloMark />
        </div>
      </section>
    )
  }

  renderZeroState() {
    const { action } = this.props
    const { meta } = action
    return (
      <section className="StreamComponent">
        { meta && meta.renderStream && meta.renderStream.asZero ?
          meta.renderStream.asZero :
          <ZeroState/>
        }
      </section>
    )
  }

  render() {
    const { className, currentUser, initModel, json, mode,
      paginatorText, renderObj, result, stream } = this.props
    const { action, gridColumnCount, hidePaginator } = this.state
    if (!action) { return null }
    const model = this.findModel(json, initModel)
    if (model && !result) {
      renderObj.data.push(model)
    } else if (!renderObj.data.length) {
      switch (stream.type) {
        case ACTION_TYPES.LOAD_STREAM_SUCCESS:
          return this.renderZeroState()
        case ACTION_TYPES.LOAD_STREAM_REQUEST:
          return this.renderLoading()
        case ACTION_TYPES.LOAD_STREAM_FAILURE:
          if (stream.error) {
            return this.renderError()
          }
          return null
        default:
          return null
      }
    }
    const { meta } = action
    const renderMethod = mode === 'grid' ? 'asGrid' : 'asList'
    const pagination = result && result.pagination ? result.pagination : emptyPagination()
    return (
      <section className={classNames('StreamComponent', className)}>
        {
          meta.renderStream[renderMethod](
            renderObj,
            json,
            currentUser,
            gridColumnCount)
        }
        {this.props.children}
        <Paginator
          hasShowMoreButton={ typeof meta.resultKey !== 'undefined' }
          isHidden={ hidePaginator }
          loadNextPage={ this.onLoadNextPage }
          messageText={ paginatorText }
          totalPages={ parseInt(pagination.totalPages, 10) }
          totalPagesRemaining={ parseInt(pagination.totalPagesRemaining, 10) }
        />
      </section>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let result
  let resultPath = state.routing.location.pathname
  const { action } = ownProps
  const meta = action ? action.meta : null
  const payload = action ? action.payload : null
  if (state.json.pages) {
    if (meta && meta.resultKey) {
      resultPath = meta.resultKey
    }
    result = state.json.pages[resultPath]
  }
  const renderObj = { data: [], nestedData: [] }
  if (result && result.type === MAPPING_TYPES.NOTIFICATIONS) {
    renderObj.data = renderObj.data.concat(result.ids)
    if (result.next) {
      renderObj.data = renderObj.data.concat(result.next.ids)
    }
  } else if (meta && result && result.type === meta.mappingType ||
            (meta && meta.resultFilter && result && result.type !== meta.mappingType)) {
    const deletedCollection = state.json[`deleted_${result.type}`]
    // don't filter out blocked ids if we are in settings
    // since you can unblock/unmute them from here
    for (const id of result.ids) {
      if (_.get(state.json, [result.type, id]) &&
          (state.routing.location.pathname === '/settings' ||
          (!deletedCollection || deletedCollection.indexOf(id) === -1))) {
        renderObj.data.push(_.get(state.json, [result.type, id]))
      }
    }
    if (result.next) {
      const nextDeletedCollection = state.json[`deleted_${result.next.type}`]
      const dataProp = payload.endpoint.pagingPath ? 'nestedData' : 'data'
      for (const nextId of result.next.ids) {
        if (state.json[result.next.type][nextId] &&
            (state.routing.location.pathname === '/settings' ||
            (!nextDeletedCollection || nextDeletedCollection.indexOf(nextId) === -1))) {
          renderObj[dataProp].push(state.json[result.next.type][nextId])
        }
      }
    }
  }
  return {
    renderObj,
    result,
    currentUser: state.profile,
    history: state.gui.history,
    mode: findLayoutMode(state.gui.modes).mode,
    json: state.json,
    stream: state.stream,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(StreamComponent)
