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
import Paginator, { emptyPagination } from '../streams/Paginator'
import { findLayoutMode } from '../../reducers/gui'
import { ZeroState } from '../zeros/Zeros'
import { ErrorState4xx } from '../errors/Errors'

export class StreamComponent extends Component {

  static propTypes = {
    action: PropTypes.object,
    children: PropTypes.any,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    initModel: PropTypes.object,
    gui: PropTypes.object.isRequired,
    json: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    stream: PropTypes.object.isRequired,
    className: PropTypes.string,
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
    if (this.refs.paginator && stream.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
      this.refs.paginator.setLoading(false)
    }
  }

  // this prevents nested stream components from clobbering parents
  shouldComponentUpdate() {
    const { stream } = this.props
    // TODO: potentially whitelist the actions that we would want to render on
    // TODO: test this!
    if (stream.meta &&
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
    if (this.props.stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS &&
      prevProps.stream.type !== ACTION_TYPES.LOAD_STREAM_SUCCESS) {
      const history = this.props.gui.history[this.state.locationKey] || {}
      const scrollTopValue = history.scrollTop
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
    const { dispatch, json, pathname } = this.props
    const { action } = this.state
    const { meta } = action
    let result = null
    if (json.pages) {
      if (meta && meta.resultKey) {
        result = json.pages[meta.resultKey]
      } else {
        result = json.pages[pathname]
      }
    }
    if (!result) { return }
    if (scrolled && meta && meta.resultKey) { return }
    const { pagination } = result
    if (!action.payload.endpoint ||
        !pagination[rel] ||
        parseInt(pagination.totalPagesRemaining, 10) === 0 ||
        !action) { return }
    if (runningFetches[pagination[rel]]) { return }
    this.refs.paginator.setLoading(true)
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
    const { className, currentUser, initModel, gui, json, pathname, stream } = this.props
    const { action } = this.state
    if (!action) { return null }
    const { meta, payload } = action
    let result = null
    let resultPath = pathname
    if (json.pages) {
      if (meta && meta.resultKey) {
        resultPath = meta.resultKey
      }
      result = json.pages[resultPath]
    }
    if (stream.error) {
      return this.renderError()
    }
    const renderObj = { data: [], nestedData: [] }
    const model = this.findModel(json, initModel)
    if (model && !result) {
      renderObj.data.push(model)
    } else if (!result || !result.type || !result.ids) {
      return stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS ?
        this.renderZeroState() :
        this.renderLoading()
    } else if (result.type === MAPPING_TYPES.NOTIFICATIONS) {
      renderObj.data = renderObj.data.concat(result.ids)
      if (result.next) {
        renderObj.data = renderObj.data.concat(result.next.ids)
      }
    } else if (result.type === meta.mappingType ||
               (meta.resultFilter && result.type !== meta.mappingType)) {
      const deletedCollection = json[`deleted_${result.type}`]
      // don't filter out blocked ids if we are in settings
      // since you can unblock/unmute them from here
      for (const id of result.ids) {
        if (_.get(json, [result.type, id]) &&
            (pathname === '/settings' ||
            (!deletedCollection || deletedCollection.indexOf(id) === -1))) {
          renderObj.data.push(_.get(json, [result.type, id]))
        }
      }
      if (result.next) {
        const nextDeletedCollection = json[`deleted_${result.next.type}`]
        const dataProp = payload.endpoint.pagingPath ? 'nestedData' : 'data'
        for (const nextId of result.next.ids) {
          if (json[result.next.type][nextId] &&
              (pathname === '/settings' ||
              (!nextDeletedCollection || nextDeletedCollection.indexOf(nextId) === -1))) {
            renderObj[dataProp].push(json[result.next.type][nextId])
          }
        }
      }
    }
    if (!renderObj.data.length) {
      if (stream.type === ACTION_TYPES.LOAD_STREAM_REQUEST || !meta) {
        return this.renderLoading()
      }
      return this.renderZeroState()
    }
    const resultMode = findLayoutMode(gui.modes)
    const renderMethod = resultMode && resultMode.mode === 'grid' ? 'asGrid' : 'asList'
    const pagination = result && result.pagination ? result.pagination : emptyPagination()
    return (
      <section className={classNames('StreamComponent', className)}>
        {
          meta.renderStream[renderMethod](
            renderObj,
            json,
            currentUser,
            this.state.gridColumnCount)
        }
        {this.props.children}
        <Paginator
          hasShowMoreButton={ typeof meta.resultKey !== 'undefined' }
          loadNextPage={ this.onLoadNextPage }
          messageText={ pathname === '/settings' ? 'See more' : null }
          ref="paginator"
          totalPages={ parseInt(pagination.totalPages, 10) }
          totalPagesRemaining={ parseInt(pagination.totalPagesRemaining, 10) }
        />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.profile,
    gui: state.gui,
    json: state.json,
    pathname: document.location.pathname,
    stream: state.stream,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(StreamComponent)
