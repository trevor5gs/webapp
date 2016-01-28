/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { runningFetches } from '../../middleware/requester'
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { findBy } from '../base/json_helper'
import { addScrollObject, removeScrollObject } from '../interface/ScrollComponent'
import { addResizeObject, removeResizeObject } from '../interface/ResizeComponent'
import { ElloMark } from '../interface/ElloIcons'
import Paginator from '../streams/Paginator'

export class StreamComponent extends Component {

  static propTypes = {
    action: PropTypes.object,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    initModel: PropTypes.object,
    json: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    stream: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { action, dispatch } = this.props
    this.state = { action }
    if (action) { dispatch(action) }
  }

  componentDidMount() {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
    addScrollObject(this)
    addResizeObject(this)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, json, pathname, stream } = nextProps
    const { action } = this.state
    if (!action) { return null }
    const { meta } = action
    let result = null
    if (json.pages) {
      result = json.pages[pathname]
    }
    if (result && !result.mode) {
      dispatch({
        type: ACTION_TYPES.SET_LAYOUT_MODE,
        payload: { mode: meta.defaultMode },
      })
    }
    // TODO: make this work for nested stream components separately of others on the page
    if (this.refs.paginator && stream.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
      this.refs.paginator.setLoading(false)
    }
  }

  // this prevents nested stream components from clobbering parents
  shouldComponentUpdate() {
    const { action, gridColumnCount } = this.state
    const { pathname, stream } = this.props
    const pathArr = pathname.split('/')
    const path = pathArr[pathArr.length - 1]
    // TODO: potentially whitelist the actions that we would want to render on
    // TODO: test this!
    if (!gridColumnCount) {
      return true
    } else if (!action || !action.payload || !stream || !stream.payload) {
      return false
    } else if (stream.type &&
               (stream.type.indexOf('POST.') === 0 ||
                stream.type.indexOf('LOAD_NEXT_CONTENT') === 0)) {
      return true
    } else if (action.payload.endpoint === stream.payload.endpoint) {
      return true
    } else if (stream.meta &&
               stream.meta.resultKey &&
               stream.payload.endpoint.path.match(stream.meta.resultKey)) {
      // if we are a nested stream component and the resultKey
      // ie: lovers as a resultKey for the endpoint for post lovers
      return true
    } else if (stream.payload.endpoint &&
               stream.payload.endpoint.path &&
               stream.payload.endpoint.path.match(path)) {
      // is used to match the endpoint required to load it
      return true
    } else if (path === 'search' || path === 'find') {
      // TODO: figure out why search is weird
      return true
    }
    return false
  }

  componentDidUpdate() {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
  }

  componentWillUnmount() {
    if (window.embetter) {
      window.embetter.stopPlayers()
    }
    removeScrollObject(this)
    removeResizeObject(this)
  }

  onScrollBottom() {
    this.loadPage('next', true)
  }

  onResize(resizeProps) {
    this.setState(resizeProps)
  }

  onLoadNextPage() {
    this.loadPage('next')
  }

  setAction(action) {
    this.setState({ action })
    this.props.dispatch(action)
  }

  loadPage(rel, scrolled = false) {
    const { dispatch, json, pathname } = this.props
    const { action } = this.state
    const { meta } = action
    let result = null
    if (json.pages) {
      if (meta && meta.resultKey) {
        result = json.pages[`${pathname}_${meta.resultKey}`]
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
    return (
      <section className="StreamComponent hasErrored">
        <div className="StreamErrorMessage">
          <img src="/static/images/support/ello-spin.gif" alt="Ello" width="130" height="130" />
          <p>This doesn't happen often, but it looks like something is broken. Hitting the back button and trying again might be your best bet. If that doesn't work you can <a href="http://ello.co/">head back to the homepage.</a></p>
          <p>There might be more information on our <a href="http://status.ello.co/">status page</a>.</p>
          <p>If all else fails you can try checking out our <a href="http://ello.threadless.com/" target="_blank">Store</a> or the <a href="https://ello.co/wtf/post/communitydirectory">Community Directory</a>.</p>
        </div>
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
    return (
      <section className="StreamComponent">
        <p>NO RESULTS</p>
      </section>
    )
  }

  render() {
    const { currentUser, initModel, json, pathname, stream } = this.props
    const { action } = this.state
    if (!action) { return null }
    const { meta, payload } = action
    let result = null
    let resultPath = pathname
    if (json.pages) {
      if (meta && meta.resultKey) {
        resultPath = `${pathname}_${meta.resultKey}`
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
      return this.renderLoading()
    } else if (result.type === MAPPING_TYPES.NOTIFICATIONS) {
      renderObj.data = renderObj.data.concat(result.ids)
      if (result.next) {
        renderObj.data = renderObj.data.concat(result.next.ids)
      }
    } else if (result.type === meta.mappingType ||
               (meta.resultFilter && result.type !== meta.mappingType)) {
      const deletedCollection = json[`deleted_${result.type}`]
      for (const id of result.ids) {
        if (json[result.type][id] &&
           (!deletedCollection || deletedCollection.indexOf(id) === -1)) {
          renderObj.data.push(json[result.type][id])
        }
      }
      if (result.next) {
        const nextDeletedCollection = json[`deleted_${result.next.type}`]
        const dataProp = payload.endpoint.pagingPath ? 'nestedData' : 'data'
        for (const nextId of result.next.ids) {
          if (json[result.next.type][nextId] &&
              (!nextDeletedCollection || nextDeletedCollection.indexOf(nextId) === -1)) {
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
    const resultMode = result && result.mode ? result.mode : meta.defaultMode
    const renderMethod = resultMode === 'grid' ? 'asGrid' : 'asList'
    return (
      <section className="StreamComponent">
        {
          meta.renderStream[renderMethod](
            renderObj,
            json,
            currentUser,
            this.state.gridColumnCount)
        }
        <Paginator
          delegate={this}
          hasShowMoreButton={typeof meta.resultKey !== 'undefined'}
          key={`${meta.resultKey || 'stream'}Paginator`}
          pagination={result ? result.pagination : {}}
          ref="paginator"
        />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.profile,
    json: state.json,
    pathname: state.routing.location.pathname,
    stream: state.stream,
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(StreamComponent)

